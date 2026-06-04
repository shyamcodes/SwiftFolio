from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from bson import ObjectId
from html import escape
from typing import Any
import base64
import json
from app.database import get_database
from app.models.user import (
    GenerateRequest, 
    GenerateResponse, 
    PortfolioResponse,
    PortfolioCreate,
    PortfolioEditRequest
)
from app.services import (
    parse_resume_from_base64,
    fetch_github_profile,
    fetch_leetcode_profile,
    fetch_hackerrank_profile,
    generate_portfolio_content
)
from app.services.translator import translate_portfolio, get_available_languages

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


def _serialize_for_export(data: Any) -> Any:
    """Recursively convert non-JSON-native values for export."""
    if isinstance(data, ObjectId):
        return str(data)
    if isinstance(data, datetime):
        return data.isoformat()
    if isinstance(data, dict):
        return {key: _serialize_for_export(value) for key, value in data.items()}
    if isinstance(data, list):
        return [_serialize_for_export(item) for item in data]
    return data


def _build_export_payload(portfolio: dict[str, Any]) -> dict[str, Any]:
    """Build a complete export payload from the stored portfolio document."""
    payload = _serialize_for_export(portfolio)
    if "_id" in payload:
        payload["id"] = payload.pop("_id")

    # Keep a stable full schema for downstream consumers.
    payload.setdefault("username", None)
    payload.setdefault("about", None)
    payload.setdefault("bio", None)
    payload.setdefault("skills", [])
    payload.setdefault("projects", [])
    payload.setdefault("resume_data", None)
    payload.setdefault("resume_base64", None)
    payload.setdefault("github_data", None)
    payload.setdefault("leetcode_data", None)
    payload.setdefault("hackerrank_data", None)
    payload.setdefault("generated_content", None)
    payload.setdefault("created_at", None)
    payload.setdefault("updated_at", None)

    payload["exported_at"] = datetime.utcnow().isoformat()
    return payload


@router.get("/latest")
async def get_latest_portfolio():
    """Get the most recently created portfolio"""
    db = get_database()
    
    portfolio = await db.portfolios.find_one(
        {},
        sort=[("created_at", -1)]
    )
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="No portfolios found")
    
    return PortfolioResponse(
        username=portfolio.get("username"),
        about=portfolio.get("about"),
        bio=portfolio.get("bio"),
        skills=portfolio.get("skills", []),
        projects=portfolio.get("projects", []),
        resume=portfolio.get("resume_data"),
        github=portfolio.get("github_data"),
        leetcode=portfolio.get("leetcode_data"),
        hackerrank=portfolio.get("hackerrank_data"),
        last_updated=portfolio.get("updated_at")
    )


@router.post("/generate", response_model=GenerateResponse)
async def generate_portfolio(request: GenerateRequest):
    """Generate a new portfolio"""
    db = get_database()
    
    # Check if portfolio already exists
    existing = await db.portfolios.find_one({"username": request.username})
    
    if existing:
        # Update existing portfolio
        portfolio_id = existing["_id"]
    else:
        # Create new portfolio
        portfolio_id = ObjectId()
    
    # Parse resume if provided
    resume_data = None
    if request.resume:
        resume_data = parse_resume_from_base64(request.resume)
    
    # Fetch data from APIs
    github_data = None
    if request.github_username:
        github_data = fetch_github_profile(request.github_username)
    
    leetcode_data = None
    if request.leetcode_username:
        leetcode_data = fetch_leetcode_profile(request.leetcode_username)
    
    hackerrank_data = None
    if request.hackerrank_username:
        hackerrank_data = fetch_hackerrank_profile(request.hackerrank_username)
    
    # Generate content using LLM
    generated_content = generate_portfolio_content(
        resume_data or {},
        github_data or {},
        leetcode_data or {},
        hackerrank_data or {}
    )
    
    # Combine data
    portfolio_data = {
        "_id": portfolio_id,
        "username": request.username,
        "resume_data": resume_data,
        "resume_base64": request.resume,  # Store original PDF for download
        "github_data": github_data,
        "leetcode_data": leetcode_data,
        "hackerrank_data": hackerrank_data,
        "about": generated_content.get("about"),
        "bio": generated_content.get("bio"),
        "skills": resume_data.get("skills", []) if resume_data else [],
        "projects": generated_content.get("project_descriptions", []),
        "generated_content": generated_content,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Save to database
    await db.portfolios.update_one(
        {"username": request.username},
        {"$set": portfolio_data},
        upsert=True
    )
    
    return GenerateResponse(
        portfolio_id=str(portfolio_id),
        username=request.username,
        status="generated"
    )


@router.get("/languages/available")
async def get_available():
    """Get list of all available languages for translation."""
    return {"languages": get_available_languages()}


@router.get("/{username}", response_model=PortfolioResponse)
async def get_portfolio(username: str):
    """Get portfolio by username"""
    db = get_database()
    
    portfolio = await db.portfolios.find_one({"username": username})
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    return PortfolioResponse(
        username=portfolio.get("username"),
        about=portfolio.get("about"),
        bio=portfolio.get("bio"),
        skills=portfolio.get("skills", []),
        projects=portfolio.get("projects", []),
        resume=portfolio.get("resume_data"),
        github=portfolio.get("github_data"),
        leetcode=portfolio.get("leetcode_data"),
        hackerrank=portfolio.get("hackerrank_data"),
        last_updated=portfolio.get("updated_at")
    )


@router.put("/{username}")
async def update_portfolio(username: str, portfolio: PortfolioCreate):
    """Update portfolio data"""
    db = get_database()
    
    existing = await db.portfolios.find_one({"username": username})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    update_data = portfolio.dict(exclude={"resume", "github_username", "leetcode_username", "hackerrank_username"})
    update_data["updated_at"] = datetime.utcnow()
    
    await db.portfolios.update_one(
        {"username": username},
        {"$set": update_data}
    )
    
    return {"message": "Portfolio updated successfully"}


@router.delete("/{username}")
async def delete_portfolio(username: str):
    """Delete portfolio"""
    db = get_database()
    
    result = await db.portfolios.delete_one({"username": username})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    return {"message": "Portfolio deleted successfully"}


@router.post("/{username}/refresh")
async def refresh_portfolio(username: str):
    """Refresh portfolio data from APIs"""
    db = get_database()
    
    portfolio = await db.portfolios.find_one({"username": username})
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Get usernames from stored data
    github_username = portfolio.get("github_data", {}).get("username")
    leetcode_username = portfolio.get("leetcode_data", {}).get("username")
    hackerrank_username = portfolio.get("hackerrank_data", {}).get("username")
    
    # Fetch fresh data
    github_data = None
    if github_username:
        github_data = fetch_github_profile(github_username)
    
    leetcode_data = None
    if leetcode_username:
        leetcode_data = fetch_leetcode_profile(leetcode_username)
    
    hackerrank_data = None
    if hackerrank_username:
        hackerrank_data = fetch_hackerrank_profile(hackerrank_username)
    
    # Generate new content
    generated_content = generate_portfolio_content(
        portfolio.get("resume_data", {}),
        github_data or {},
        leetcode_data or {},
        hackerrank_data or {}
    )
    
    # Update database
    await db.portfolios.update_one(
        {"username": username},
        {"$set": {
            "github_data": github_data,
            "leetcode_data": leetcode_data,
            "hackerrank_data": hackerrank_data,
            "generated_content": generated_content,
            "about": generated_content.get("about"),
            "bio": generated_content.get("bio"),
            "projects": generated_content.get("project_descriptions", []),
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Portfolio refreshed successfully"}


@router.get("/{username}/resume/download")
async def download_resume(username: str):
    """Download the resume PDF"""
    db = get_database()
    
    portfolio = await db.portfolios.find_one({"username": username})
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    resume_base64 = portfolio.get("resume_base64")
    
    if not resume_base64:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Decode base64 to bytes
    try:
        pdf_bytes = base64.b64decode(resume_base64)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error decoding resume")
    
    # Return as file download
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={username}_resume.pdf"}
    )


@router.patch("/{username}/edit")
async def edit_portfolio(username: str, request: PortfolioEditRequest):
    """Edit specific portfolio fields"""
    db = get_database()
    
    existing = await db.portfolios.find_one({"username": username})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Only update provided fields
    update_data = {}
    if request.about is not None:
        update_data["about"] = request.about
    if request.bio is not None:
        update_data["bio"] = request.bio
    if request.skills is not None:
        update_data["skills"] = request.skills
    if request.projects is not None:
        update_data["projects"] = request.projects
    if request.language is not None:
        update_data["language"] = request.language
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.portfolios.update_one(
        {"username": username},
        {"$set": update_data}
    )
    
    return {"message": "Portfolio edited successfully", "data": update_data}


@router.post("/{username}/translate/{language}")
async def translate_portfolio_endpoint(username: str, language: str):
    """Translate portfolio to a specific language."""
    db = get_database()
    
    portfolio = await db.portfolios.find_one({"username": username})
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Preserve original content if not already saved
    if "original_content" not in portfolio:
        original_content = {
            "about": portfolio.get("about"),
            "bio": portfolio.get("bio"),
            "skills": portfolio.get("skills", []),
            "projects": portfolio.get("projects", [])
        }
        await db.portfolios.update_one(
            {"username": username},
            {"$set": {"original_content": original_content}}
        )
        portfolio["original_content"] = original_content
    
    # If requesting English, restore original content
    if language.lower() == "en":
        original = portfolio["original_content"]
        update_data = {
            "about": original.get("about"),
            "bio": original.get("bio"),
            "skills": original.get("skills", []),
            "projects": original.get("projects", []),
            "language": "en",
            "updated_at": datetime.utcnow()
        }
        
        await db.portfolios.update_one(
            {"username": username},
            {"$set": update_data}
        )
        
        return {
            "message": "Portfolio restored to English successfully",
            "language": "en",
            "data": {
                "about": original.get("about"),
                "bio": original.get("bio"),
                "skills": original.get("skills", []),
                "projects": original.get("projects", [])
            }
        }
    
    # Always translate from original content
    source_content = {
        "about": portfolio["original_content"].get("about"),
        "bio": portfolio["original_content"].get("bio"),
        "skills": portfolio["original_content"].get("skills", []),
        "projects": portfolio["original_content"].get("projects", [])[:5]  # Limit to 5 for speed
    }
    
    try:
        # Translate from original
        translated_portfolio = translate_portfolio(source_content, language)
        
        # Update the portfolio with translated content
        update_data = {
            "about": translated_portfolio.get("about"),
            "bio": translated_portfolio.get("bio"),
            "skills": translated_portfolio.get("skills", [])[:10],
            "projects": translated_portfolio.get("projects", []),
            "language": language,
            "updated_at": datetime.utcnow()
        }
        
        await db.portfolios.update_one(
            {"username": username},
            {"$set": update_data}
        )
        
        return {
            "message": f"Portfolio translated to {language} successfully",
            "language": language,
            "data": {
                "about": translated_portfolio.get("about"),
                "bio": translated_portfolio.get("bio"),
                "skills": translated_portfolio.get("skills", []),
                "projects": translated_portfolio.get("projects", [])
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )


@router.get("/{username}/export/html")
async def export_portfolio_html(username: str):
    """Export the complete portfolio document as an optimized HTML report."""
    db = get_database()
    
    portfolio = await db.portfolios.find_one({"username": username})
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    export_data = _build_export_payload(portfolio)

    # Get all skills (both manual and generated)
    manual_skills = export_data.get("skills", []) or []
    generated_content = export_data.get("generated_content") or {}
    generated_skills_summary = generated_content.get("skills_summary", "")

    # Get all projects
    manual_projects = export_data.get("projects", []) or []
    generated_project_descriptions = generated_content.get("project_descriptions", []) or []

    # HTML for manual skills
    manual_skills_html = "".join(
        [f"<span class=\"chip\">{escape(str(skill))}</span>" for skill in manual_skills]
    ) or ""

    # HTML for manual projects
    manual_project_cards_html = "".join(
        [
            "".join(
                [
                    "<article class=\"card\">",
                    f"<h3>{escape(str(project.get('name', 'Untitled Project')))}</h3>",
                    f"<p>{escape(str(project.get('description', 'No description')))}</p>",
                    (f"<p><strong>Language:</strong> {escape(str(project.get('language', 'N/A')))}</p>" if project.get('language') else ""),
                    (f"<p><strong>Stars:</strong> {escape(str(project.get('stars', 0)))}</p>" if project.get('stars') else ""),
                    (
                        f"<p><a href=\"{escape(str(project.get('url')))}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"cta-link\">"
                        "→ Visit Repository</a></p>"
                        if project.get("url")
                        else ""
                    ),
                    "</article>",
                ]
            )
            for project in manual_projects
        ]
    ) or ""

    # Display generated project descriptions if manual projects are empty
    generated_project_html = ""
    if not manual_projects and generated_project_descriptions:
        generated_project_html = "".join(
            [
                "".join(
                    [
                        "<article class=\"card generated\">",
                        f"<p>{escape(str(desc))}</p>",
                        "</article>",
                    ]
                )
                for desc in generated_project_descriptions
                if desc
            ]
        )

    all_projects_html = (manual_project_cards_html + generated_project_html) or "<p class=\"empty\">No projects added yet.</p>"
    all_skills_html = manual_skills_html or (f"<p class=\"summary\">{escape(str(generated_skills_summary))}</p>" if generated_skills_summary else "<p class=\"empty\">No skills added yet.</p>")

    # Count statistics
    skills_count = len(manual_skills) if manual_skills else 0
    projects_count = len(manual_projects) if manual_projects else 0
    github_connected = "✓" if export_data.get("github_data") else "✗"
    leetcode_connected = "✓" if export_data.get("leetcode_data") else "✗"
    hackerrank_connected = "✓" if export_data.get("hackerrank_data") else "✗"

    # HTML for platform data
    def render_github_data(github: Any) -> str:
        if not github:
            return "<p class=\"empty\">Not connected yet.</p>"
        return f"""
            <div class="platform-info">
                <p><strong>{escape(str(github.get('name', 'N/A')))}</strong></p>
                <p class="username">@{escape(str(github.get('username', 'N/A')))}</p>
                <p>{escape(str(github.get('bio', 'No bio')))}</p>
                <div class="stats">
                    <span class="stat"><strong>{escape(str(github.get('public_repos', 0)))}</strong> Repos</span>
                    <span class="stat"><strong>{escape(str(github.get('followers', 0)))}</strong> Followers</span>
                    <span class="stat"><strong>{escape(str(github.get('following', 0)))}</strong> Following</span>
                </div>
                <p><a href="https://github.com/{escape(str(github.get('username')))}" target="_blank" rel="noopener noreferrer" class="cta-link">→ Visit GitHub Profile</a></p>
            </div>
        """

    def render_leetcode_data(leetcode: Any) -> str:
        if not leetcode:
            return "<p class=\"empty\">Not connected yet.</p>"
        return f"""
            <div class="platform-info">
                <p><strong>{escape(str(leetcode.get('name', 'N/A')))}</strong></p>
                <p class="username">@{escape(str(leetcode.get('username', 'N/A')))}</p>
                <p class="meta">{escape(str(leetcode.get('country', 'N/A')))}</p>
                <div class="stats">
                    <span class="stat"><strong>{escape(str(leetcode.get('problems_solved', 0)))}</strong> Solved</span>
                    <span class="stat"><strong>#{escape(str(leetcode.get('ranking', 'N/A')))}</strong> Rank</span>
                </div>
                <div class="difficulty">
                    <span class="label">Easy:</span> {escape(str(leetcode.get('easy_solved', 0)))}
                    <span class="label">Medium:</span> {escape(str(leetcode.get('medium_solved', 0)))}
                    <span class="label">Hard:</span> {escape(str(leetcode.get('hard_solved', 0)))}
                </div>
                <p class="acceptance"><strong>Acceptance Rate:</strong> {escape(str(leetcode.get('acceptance_rate', 'N/A')))}%</p>
                <p><a href="{escape(str(leetcode.get('profile_url', '#')))}" target="_blank" rel="noopener noreferrer" class="cta-link">→ Visit LeetCode Profile</a></p>
            </div>
        """

    def render_hackerrank_data(hackerrank: Any) -> str:
        if not hackerrank:
            return "<p class=\"empty\">Not connected yet.</p>"
        badges_str = ", ".join(str(b) for b in hackerrank.get('badges', []))
        badges_html = f'<p class="badges">🏅 {escape(badges_str)}</p>' if hackerrank.get('badges') else ''
        return f"""
            <div class="platform-info">
                <p><strong>@{escape(str(hackerrank.get('username', 'N/A')))}</strong></p>
                <div class="stats">
                    <span class="stat"><strong>{escape(str(hackerrank.get('problems_solved', 0)))}</strong> Problems Solved</span>
                    <span class="stat"><strong>{escape(str(len(hackerrank.get('badges', []))))}</strong> Badges</span>
                </div>
                {badges_html}
            </div>
        """

    github_html = render_github_data(export_data.get("github_data"))
    leetcode_html = render_leetcode_data(export_data.get("leetcode_data"))
    hackerrank_html = render_hackerrank_data(export_data.get("hackerrank_data"))

    # Resume section
    resume_data = export_data.get("resume_data")
    resume_section = ""
    if resume_data:
        education_html = "".join([
            f"<li><strong>{escape(str(edu.get('degree', 'N/A')))}</strong><br/>" +
            f"<small>{escape(str(edu.get('details', '')))}</small></li>"
            for edu in resume_data.get('education', [])
        ]) if resume_data.get('education') else ""
        
        experience_html = "".join([
            f"<li><strong>{escape(str(exp.get('title', 'N/A')))}</strong><br/>" +
            f"<small>{escape(str(exp.get('details', '')))}</small></li>"
            for exp in resume_data.get('experience', [])
        ]) if resume_data.get('experience') else ""
        
        skills_str = ", ".join(str(s) for s in resume_data.get("skills", [])) if resume_data.get('skills') else ""
        skills_html = f'<div class="resume-block"><h3>Technical Skills</h3><p>{escape(skills_str)}</p></div>' if resume_data.get('skills') else ""
        
        education_section = f'<div class="resume-block"><h3>Education</h3><ul>{education_html}</ul></div>' if education_html else ""
        experience_section = f'<div class="resume-block"><h3>Experience</h3><ul>{experience_html}</ul></div>' if experience_html else ""
        
        resume_section = f"""
        <section class="section">
            <h2>Resume</h2>
            {education_section}
            {experience_section}
            {skills_html}
        </section>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{escape(str(export_data.get('username', username)))} Portfolio</title>
    <style>
        :root {{
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --accent: #0ea5e9;
            --bg: #f8fafc;
            --card: #ffffff;
            --text: #0f172a;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --success: #10b981;
            --warning: #f59e0b;
        }}
        * {{ box-sizing: border-box; }}
        body {{ margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 32px 16px 48px; }}
        
        /* Header */
        .header {{ background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent) 100%); color: #fff; border-radius: 16px; padding: 40px 32px; margin-bottom: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .header h1 {{ margin: 0 0 12px; font-size: 2.5rem; font-weight: 700; }}
        .header .bio {{ font-size: 1.1rem; opacity: 0.95; margin-bottom: 16px; }}
        .header .meta {{ display: flex; gap: 24px; font-size: 0.9rem; opacity: 0.85; }}
        .header .meta span {{ display: flex; align-items: center; gap: 6px; }}
        
        /* Stats Bar */
        .stats-bar {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 32px; }}
        .stat-card {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .stat-card .value {{ font-size: 1.8rem; font-weight: 700; color: var(--primary); }}
        .stat-card .label {{ font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }}
        
        /* Sections */
        .section {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 28px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .section h2 {{ margin: 0 0 16px; font-size: 1.5rem; font-weight: 600; color: var(--primary-dark); border-bottom: 2px solid var(--accent); padding-bottom: 12px; }}
        .section h3 {{ margin: 20px 0 10px; font-size: 1.1rem; font-weight: 600; }}
        .section p {{ margin: 8px 0; color: var(--text-muted); }}
        
        /* Skills */
        .chips {{ display: flex; flex-wrap: wrap; gap: 8px; }}
        .chip {{ background: linear-gradient(135deg, #dbeafe, #e0f2fe); color: var(--primary-dark); border-radius: 999px; padding: 8px 14px; font-size: 0.9rem; font-weight: 500; border: 1px solid #bae6fd; }}
        
        /* Projects */
        .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }}
        .card {{ background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; padding: 18px; transition: all 0.3s ease; }}
        .card:hover {{ box-shadow: 0 8px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }}
        .card h3 {{ margin: 0 0 10px; font-size: 1.1rem; color: var(--primary-dark); }}
        .card p {{ margin: 6px 0; font-size: 0.9rem; color: var(--text-muted); }}
        .card.generated {{ border-left: 4px solid var(--accent); background: #ecf9ff; }}
        .cta-link {{ color: var(--primary); font-weight: 600; text-decoration: none; transition: color 0.2s; }}
        .cta-link:hover {{ color: var(--primary-dark); text-decoration: underline; }}
        
        /* Platform Info */
        .platform-info {{ padding: 16px; background: #f8fafc; border-radius: 8px; }}
        .platform-info p {{ margin: 6px 0; }}
        .username {{ color: var(--accent); font-size: 0.95rem; font-weight: 600; }}
        .stats {{ display: flex; gap: 16px; margin: 12px 0; flex-wrap: wrap; }}
        .stat {{ background: var(--bg); padding: 8px 12px; border-radius: 6px; font-size: 0.9rem; }}
        .stat strong {{ color: var(--primary); }}
        .difficulty {{ background: #f0f9ff; padding: 12px; border-radius: 8px; margin: 12px 0; font-size: 0.9rem; }}
        .difficulty .label {{ font-weight: 600; color: var(--primary-dark); margin-right: 8px; }}
        .acceptance {{ margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }}
        .badges {{ color: var(--text-muted); }}
        .resume-block {{ margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }}
        .resume-block:last-child {{ border-bottom: none; }}
        .resume-block ul {{ margin: 10px 0; padding-left: 20px; }}
        .resume-block li {{ margin: 8px 0; }}
        .resume-block small {{ color: var(--text-muted); }}
        
        /* Empty State */
        .empty {{ color: var(--text-muted); font-style: italic; text-align: center; padding: 24px; }}
        .summary {{ color: var(--text-muted); font-size: 1rem; line-height: 1.8; }}
        
        /* Footer */
        .footer {{ text-align: center; padding-top: 32px; margin-top: 48px; border-top: 2px solid var(--border); color: var(--text-muted); font-size: 0.9rem; }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            .header {{ padding: 24px 16px; }}
            .header h1 {{ font-size: 2rem; }}
            .stats-bar {{ grid-template-columns: repeat(2, 1fr); }}
            .grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>{escape(str(export_data.get('username', username)))}</h1>
            <p class="bio">{escape(str(export_data.get('bio') or 'Professional Portfolio'))}</p>
            <div class="meta">
                <span>📅 Updated: {escape(str(export_data.get('updated_at', 'N/A')).split('T')[0])}</span>
                <span>💾 Exported: {escape(str(export_data.get('exported_at', 'N/A')).split('T')[0])}</span>
            </div>
        </header>

        <div class="stats-bar">
            <div class="stat-card">
                <div class="value">{skills_count}</div>
                <div class="label">Skills</div>
            </div>
            <div class="stat-card">
                <div class="value">{projects_count}</div>
                <div class="label">Projects</div>
            </div>
            <div class="stat-card">
                <div class="value">{github_connected}</div>
                <div class="label">GitHub</div>
            </div>
            <div class="stat-card">
                <div class="value">{leetcode_connected}</div>
                <div class="label">LeetCode</div>
            </div>
            <div class="stat-card">
                <div class="value">{hackerrank_connected}</div>
                <div class="label">HackerRank</div>
            </div>
        </div>

        <section class="section">
            <h2>About Me</h2>
            <p>{escape(str(export_data.get('about') or 'No about section provided.'))}</p>
            <h3>AI Generated Profile</h3>
            <p>{escape(str(generated_content.get('about') or 'No AI-generated content yet.'))}</p>
        </section>

        <section class="section">
            <h2>Technical Skills</h2>
            <div class="chips">{all_skills_html}</div>
        </section>

        <section class="section">
            <h2>Featured Projects</h2>
            <div class="grid">{all_projects_html}</div>
        </section>

        <section class="section">
            <h2>Coding Profiles</h2>
            <h3>GitHub</h3>
            {github_html}
            <h3 style="margin-top: 20px;">LeetCode</h3>
            {leetcode_html}
            <h3 style="margin-top: 20px;">HackerRank</h3>
            {hackerrank_html}
        </section>

        {resume_section}

        <div class="footer">
            <p>Generated with ✨ SwiftFolio | Portfolio generated on {escape(str(export_data.get('exported_at', 'N/A')).split('T')[0])}</p>
        </div>
    </div>
</body>
</html>"""

    return StreamingResponse(
        iter([html_content.encode('utf-8')]),
        media_type="text/html",
        headers={"Content-Disposition": f"attachment; filename={username}_portfolio.html"}
    )


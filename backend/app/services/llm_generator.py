import json
from typing import Dict, Optional
from openai import OpenAI
from app.config import get_settings

settings = get_settings()


def generate_portfolio_content(
    resume_data: Dict,
    github_data: Dict,
    leetcode_data: Dict,
    hackerrank_data: Dict
) -> Dict:
    """Generate portfolio content using OpenAI LLM or intelligent defaults"""
    
    if not settings.openai_api_key:
        # Return intelligent default content if no API key
        return generate_intelligent_portfolio_content(resume_data, github_data, leetcode_data, hackerrank_data)
    
    try:
        # Initialize OpenAI with just the API key
        from openai import OpenAI as OpenAIClient
        client = OpenAIClient(api_key=settings.openai_api_key)
        
        # Prepare context from all data sources
        context = prepare_context(resume_data, github_data, leetcode_data, hackerrank_data)
        
        prompt = f"""You are an expert portfolio writer specializing in tech professionals. Create a compelling, authentic portfolio for a developer. Make it engaging, professional, and highlights genuine achievements.

Developer Information:
{context}

Generate a JSON response with EXACTLY this structure (valid JSON):
{{
    "about": "A concise, compelling 2-3 sentence about section that highlights their unique value proposition",
    "bio": "A professional 5-7 sentence bio that tells their developer story, includes achievements, and shows personality",
    "skills_summary": "A 2-3 sentence summary of their technical expertise and specialization",
    "project_descriptions": [
        {{"name": "Project Name", "description": "2-3 sentence compelling description highlighting impact and technology"}}
    ]
}}

Requirements:
- About: Should be unique and engaging, avoid generic phrases like "passionate developer"
- Bio: Tell a story - include background, key achievements, what drives them, future goals
- Skills: Be specific about expertise levels and domains
- Projects: Describe impact and learning, not just what was built
- Tone: Professional but personable
- Length: Concise but impactful"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert technical portfolio writer who creates compelling, authentic, and impressive developer portfolios."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1500
        )
        
        result = response.choices[0].message.content
        
        # Parse JSON response
        try:
            # Try to extract JSON from response
            if "```json" in result:
                result = result.split("```json")[1].split("```")[0]
            elif "```" in result:
                result = result.split("```")[1].split("```")[0]
            
            content = json.loads(result.strip())
            return content
        except json.JSONDecodeError:
            # If JSON parsing fails, fall back to intelligent defaults
            return generate_intelligent_portfolio_content(resume_data, github_data, leetcode_data, hackerrank_data)
            
    except Exception as e:
        print(f"Error generating content with LLM: {e}")
        print(f"Error type: {type(e).__name__}")
        return generate_intelligent_portfolio_content(resume_data, github_data, leetcode_data, hackerrank_data)


def prepare_context(
    resume_data: Dict,
    github_data: Dict,
    leetcode_data: Dict,
    hackerrank_data: Dict
) -> str:
    """Prepare context string from all data sources"""
    
    context_parts = []
    
    # Resume data
    if resume_data.get("name"):
        context_parts.append(f"Name: {resume_data['name']}")
    if resume_data.get("email"):
        context_parts.append(f"Email: {resume_data['email']}")
    if resume_data.get("skills"):
        context_parts.append(f"Skills: {', '.join(resume_data['skills'])}")
    if resume_data.get("experience"):
        context_parts.append(f"Experience: {resume_data['experience']}")
    if resume_data.get("education"):
        context_parts.append(f"Education: {resume_data['education']}")
    
    # GitHub data
    if github_data and not github_data.get("error"):
        context_parts.append(f"\nGitHub: {github_data.get('public_repos', 0)} public repos, {github_data.get('followers', 0)} followers")
        if github_data.get("repos"):
            repo_names = [r.get("name") for r in github_data["repos"][:5]]
            context_parts.append(f"Top repos: {', '.join(repo_names)}")
    
    # LeetCode data
    if leetcode_data and not leetcode_data.get("error"):
        context_parts.append(f"\nLeetCode: {leetcode_data.get('problems_solved', 0)} problems solved "
                           f"({leetcode_data.get('easy_solved', 0)} easy, {leetcode_data.get('medium_solved', 0)} medium, "
                           f"{leetcode_data.get('hard_solved', 0)} hard)")
        if leetcode_data.get("ranking"):
            context_parts.append(f"LeetCode ranking: {leetcode_data['ranking']}")
    
    # HackerRank data
    if hackerrank_data and not hackerrank_data.get("error"):
        if hackerrank_data.get("problems_solved"):
            context_parts.append(f"\nHackerRank: {hackerrank_data['problems_solved']} problems solved")
        if hackerrank_data.get("badges"):
            context_parts.append(f"Badges: {', '.join(hackerrank_data['badges'])}")
    
    return "\n".join(context_parts)


def generate_intelligent_portfolio_content(
    resume_data: Dict,
    github_data: Dict,
    leetcode_data: Dict,
    hackerrank_data: Dict
) -> Dict:
    """Generate intelligent portfolio content with smart defaults"""
    
    # Extract core information
    name = extract_name(resume_data, github_data)
    skills = extract_skills(resume_data, github_data)
    experience_level = calculate_experience_level(resume_data, github_data, leetcode_data)
    specializations = identify_specializations(resume_data, github_data, skills)
    achievements = extract_achievements(github_data, leetcode_data, hackerrank_data)
    
    # Generate About Section
    about = generate_about_section(name, specializations, achievements, experience_level)
    
    # Generate Bio
    bio = generate_bio_section(name, specializations, experience_level, github_data, leetcode_data, achievements)
    
    # Generate Skills Summary
    skills_summary = generate_skills_summary(specializations, skills)
    
    # Generate Project Descriptions
    project_descriptions = generate_project_descriptions(github_data, specializations)
    
    return {
        "about": about,
        "bio": bio,
        "skills_summary": skills_summary,
        "project_descriptions": project_descriptions
    }


def extract_name(resume_data: Dict, github_data: Dict) -> str:
    """Extract developer name from available sources"""
    if resume_data and resume_data.get("name"):
        return resume_data["name"]
    if github_data and github_data.get("name"):
        return github_data["name"]
    return "Developer"


def extract_skills(resume_data: Dict, github_data: Dict) -> list:
    """Extract and deduplicate skills from all sources"""
    skills_set = set()
    
    # From resume
    if resume_data and resume_data.get("skills"):
        if isinstance(resume_data["skills"], list):
            skills_set.update(resume_data["skills"])
        elif isinstance(resume_data["skills"], str):
            skills_set.update([s.strip() for s in resume_data["skills"].split(",")])
    
    # Infer from GitHub repos
    if github_data and github_data.get("repos"):
        languages = set()
        for repo in github_data.get("repos", []):
            if repo.get("language"):
                languages.add(repo["language"])
        skills_set.update(languages)
    
    return sorted(list(skills_set))[:10]  # Top 10 skills


def calculate_experience_level(resume_data: Dict, github_data: Dict, leetcode_data: Dict) -> str:
    """Estimate experience level based on available data"""
    score = 0
    
    # GitHub contribution score
    if github_data and not github_data.get("error"):
        repos = github_data.get("public_repos", 0)
        followers = github_data.get("followers", 0)
        if repos > 20:
            score += 3
        elif repos > 10:
            score += 2
        elif repos > 0:
            score += 1
        if followers > 50:
            score += 2
        elif followers > 10:
            score += 1
    
    # LeetCode score
    if leetcode_data and not leetcode_data.get("error"):
        problems_solved = leetcode_data.get("problems_solved", 0)
        if problems_solved > 500:
            score += 3
        elif problems_solved > 200:
            score += 2
        elif problems_solved > 50:
            score += 1
    
    # Years of experience
    if resume_data and resume_data.get("experience"):
        score += 2
    
    if score >= 7:
        return "senior"
    elif score >= 4:
        return "intermediate"
    else:
        return "junior"


def identify_specializations(resume_data: Dict, github_data: Dict, skills: list) -> list:
    """Identify key specializations from skills and experience"""
    specializations = []
    
    # Common specialization patterns
    web_tech = {"javascript", "typescript", "react", "angular", "vue", "nodejs", "express", "django", "flask", "spring"}
    mobile_tech = {"swift", "kotlin", "flutter", "react native", "xamarin"}
    data_tech = {"python", "r", "pandas", "numpy", "tensorflow", "pytorch", "sql", "spark"}
    devops_tech = {"docker", "kubernetes", "aws", "gcp", "azure", "terraform", "jenkins", "gitops"}
    
    skills_lower = {s.lower() for s in skills}
    
    if skills_lower & web_tech:
        specializations.append("Web Development")
    if skills_lower & mobile_tech:
        specializations.append("Mobile Development")
    if skills_lower & data_tech:
        specializations.append("Data Science")
    if skills_lower & devops_tech:
        specializations.append("DevOps & Cloud")
    
    # If no matches, use top skills
    if not specializations and skills:
        specializations = [skills[0]]
    
    return specializations[:3]  # Top 3 specializations


def extract_achievements(github_data: Dict, leetcode_data: Dict, hackerrank_data: Dict) -> Dict:
    """Extract notable achievements across platforms"""
    achievements = {}
    
    if github_data and not github_data.get("error"):
        achievements["repos"] = github_data.get("public_repos", 0)
        achievements["followers"] = github_data.get("followers", 0)
        achievements["github_active"] = achievements["repos"] > 10
    
    if leetcode_data and not leetcode_data.get("error"):
        achievements["problems_solved"] = leetcode_data.get("problems_solved", 0)
        achievements["leetcode_active"] = achievements["problems_solved"] > 50
    
    if hackerrank_data and not hackerrank_data.get("error"):
        achievements["hr_problems"] = hackerrank_data.get("problems_solved", 0)
        achievements["badges"] = hackerrank_data.get("badges", [])
    
    return achievements


def generate_about_section(name: str, specializations: list, achievements: Dict, experience_level: str) -> str:
    """Generate compelling about section"""
    
    specialization_text = " and ".join(specializations) if specializations else "software development"
    
    if experience_level == "senior":
        about = f"{name} is an experienced developer specializing in {specialization_text}. "
        about += f"With a proven track record of building scalable systems and solving complex technical challenges, "
        about += f"they bring both expertise and innovative thinking to every project."
    elif experience_level == "intermediate":
        about = f"{name} is a skilled developer focused on {specialization_text}. "
        about += f"Driven by curiosity and a commitment to continuous learning, "
        about += f"they create elegant solutions to challenging problems."
    else:  # junior
        about = f"{name} is a passionate developer exploring {specialization_text}. "
        about += f"With a strong foundation in computer science principles and hands-on project experience, "
        about += f"they're committed to writing clean, efficient code and growing as a professional."
    
    return about


def generate_bio_section(
    name: str, 
    specializations: list, 
    experience_level: str, 
    github_data: Dict,
    leetcode_data: Dict,
    achievements: Dict
) -> str:
    """Generate detailed professional bio"""
    
    bio_parts = []
    
    # Opening
    if experience_level == "senior":
        bio_parts.append(f"{name} brings extensive experience in {', '.join(specializations)}. ")
    elif experience_level == "intermediate":
        bio_parts.append(f"{name} is a developer with solid experience in {', '.join(specializations)}. ")
    else:
        bio_parts.append(f"{name} is an aspiring developer with growing expertise in {', '.join(specializations)}. ")
    
    # GitHub contribution
    if achievements.get("github_active"):
        repos = achievements.get("repos", 0)
        followers = achievements.get("followers", 0)
        bio_parts.append(f"On GitHub, they maintain {repos} public repositories and have built a following of {followers} developers. ")
    
    # Problem-solving background
    if achievements.get("leetcode_active"):
        problems = achievements.get("problems_solved", 0)
        bio_parts.append(f"Having solved {problems}+ LeetCode problems, they have strong algorithmic and problem-solving skills. ")
    elif achievements.get("hr_problems"):
        bio_parts.append(f"They actively practice coding challenges and competitive programming. ")
    
    # Personality/Values
    if experience_level == "senior":
        bio_parts.append(f"Beyond coding, they're passionate about mentoring junior developers, architecting scalable solutions, and exploring emerging technologies. ")
    else:
        bio_parts.append(f"They're passionate about learning new technologies, collaborating with teams, and building projects that make an impact. ")
    
    # Vision
    bio_parts.append(f"Their goal is to create meaningful software that solves real problems and contributes to the tech community.")
    
    return "".join(bio_parts)


def generate_skills_summary(specializations: list, skills: list) -> str:
    """Generate professional skills summary"""
    
    if not specializations and not skills:
        return "Proficient in modern development technologies and principles."
    
    summary = f"Expert in {', '.join(specializations)}. "
    
    if skills:
        tech_stack = ", ".join(skills[:5])
        summary += f"Technical stack includes {tech_stack}, and more. "
    
    summary += "Committed to writing clean, maintainable code and staying current with industry best practices."
    
    return summary


def generate_project_descriptions(github_data: Dict, specializations: list) -> list:
    """Generate compelling project descriptions"""
    
    descriptions = []
    
    if not github_data or github_data.get("error") or not github_data.get("repos"):
        return descriptions
    
    spec_keywords = {s.lower(): s for s in specializations}
    
    for repo in github_data.get("repos", [])[:5]:
        name = repo.get("name", "Project")
        original_desc = repo.get("description") or ""
        language = repo.get("language") or "Software"
        stars = repo.get("stars", 0)
        
        # Create compelling description
        if original_desc and len(original_desc) > 20:
            # Use original description with enhancements
            desc = original_desc
            if stars > 10:
                desc += f" (⭐ {stars} stars)"
        else:
            # Generate description from language/context
            desc = f"A {language} project demonstrating "
            if "language" in language.lower():
                desc += "language fundamentals and best practices"
            else:
                desc += f"{language} expertise and practical application design"
        
        descriptions.append({
            "name": name,
            "description": desc
        })
    
    return descriptions


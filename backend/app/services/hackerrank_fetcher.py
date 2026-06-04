import requests
from typing import Dict, List, Optional


def fetch_hackerrank_profile(username: str) -> Dict:
    """Fetch HackerRank user profile and stats"""
    try:
        # HackerRank API (using public profile)
        # Note: HackerRank doesn't have a public API, so we'll scrape the profile page
        profile_url = f"https://www.hackerrank.com/{username}"
        
        # Since HackerRank doesn't have a public API, we'll return a placeholder
        # In production, you might want to use web scraping or their enterprise API
        return {
            "username": username,
            "error": "HackerRank public API not available. Please add manually.",
            "profile_url": profile_url,
            "problems_solved": 0,
            "badges": [],
            "certificates": []
        }
    except Exception as e:
        print(f"Error fetching HackerRank data: {e}")
        return {
            "username": username,
            "error": str(e)
        }


def fetch_hackerrank_skills(username: str) -> Dict:
    """Fetch HackerRank skills/certifications"""
    try:
        # HackerRank skills API (if available)
        skills_url = f"https://www.hackerrank.com/rest/contests/master/submissions/{username}"
        
        response = requests.get(skills_url, timeout=10)
        
        if response.status_code != 200:
            return {
                "skills": [],
                "certifications": []
            }
        
        data = response.json()
        
        return {
            "skills": data.get("skills", []),
            "certifications": data.get("certifications", [])
        }
    except Exception as e:
        print(f"Error fetching HackerRank skills: {e}")
        return {
            "skills": [],
            "certifications": []
        }


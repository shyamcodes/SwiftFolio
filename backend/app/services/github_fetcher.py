import requests
from typing import Dict, List, Optional
from app.config import get_settings

settings = get_settings()


def fetch_github_profile(username: str) -> Dict:
    """Fetch GitHub user profile and repositories"""
    try:
        headers = {}
        if settings.github_token:
            headers["Authorization"] = f"token {settings.github_token}"
        
        # Fetch user profile
        user_url = f"https://api.github.com/users/{username}"
        user_response = requests.get(user_url, headers=headers, timeout=10)

        # If token present but invalid (401), retry without auth header to allow public access
        if user_response.status_code == 401 and headers.get("Authorization"):
            user_response = requests.get(user_url, timeout=10)

        if user_response.status_code != 200:
            return {
                "username": username,
                "error": f"User not found: {user_response.status_code}"
            }

        user_data = user_response.json()
        
        # Fetch repositories (sorted by stars)
        repos_url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=10"
        repos_response = requests.get(repos_url, headers=headers, timeout=10)
        if repos_response.status_code == 401 and headers.get("Authorization"):
            repos_response = requests.get(repos_url, timeout=10)
        
        repos = []
        if repos_response.status_code == 200:
            repos_data = repos_response.json()
            for repo in repos_data:
                repos.append({
                    "name": repo.get("name"),
                    "description": repo.get("description"),
                    "url": repo.get("html_url"),
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "topics": repo.get("topics", []),
                    "updated_at": repo.get("updated_at")
                })
        
        return {
            "username": username,
            "name": user_data.get("name"),
            "bio": user_data.get("bio"),
            "avatar_url": user_data.get("avatar_url"),
            "public_repos": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "following": user_data.get("following", 0),
            "repos": repos,
            "profile_url": user_data.get("html_url")
        }
    except Exception as e:
        print(f"Error fetching GitHub data: {e}")
        return {
            "username": username,
            "error": str(e)
        }


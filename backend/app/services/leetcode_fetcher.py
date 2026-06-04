import requests
from typing import Dict, Optional


def fetch_leetcode_profile(username: str) -> Dict:
    """Fetch LeetCode user profile and stats"""
    try:
        # LeetCode GraphQL API
        graphql_url = "https://leetcode.com/graphql"
        
        query = """
        query userProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    realName
                    userAvatar
                    ranking
                    reputation
                    websites
                    countryName
                    company
                    school
                    aboutMe
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                    totalSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
        """
        
        variables = {"username": username}
        
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        response = requests.post(
            graphql_url,
            json={"query": query, "variables": variables},
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            print(f"LeetCode API error: {response.status_code} - {response.text[:200]}")
            return {
                "username": username,
                "error": f"Request failed: {response.status_code}"
            }
        
        data = response.json()
        
        if "errors" in data:
            return {
                "username": username,
                "error": "User not found"
            }
        
        user = data.get("data", {}).get("matchedUser")
        
        if not user:
            return {
                "username": username,
                "error": "User not found"
            }
        
        profile = user.get("profile", {})
        submit_stats = user.get("submitStats", {})
        ac_submissions = submit_stats.get("acSubmissionNum", [])
        
        # Parse submission stats
        easy_solved = 0
        medium_solved = 0
        hard_solved = 0
        
        for stat in ac_submissions:
            difficulty = stat.get("difficulty", "").lower()
            count = stat.get("count", 0)
            
            if difficulty == "easy":
                easy_solved = count
            elif difficulty == "medium":
                medium_solved = count
            elif difficulty == "hard":
                hard_solved = count
        
        total_solved = easy_solved + medium_solved + hard_solved
        
        # Calculate acceptance rate and total submissions
        total_submissions = 0
        total_stats_by_difficulty = {}
        for stat in submit_stats.get("totalSubmissionNum", []):
            difficulty = stat.get("difficulty", "").lower()
            count = stat.get("count", 0)
            total_submissions += count
            total_stats_by_difficulty[difficulty] = count
        
        acceptance_rate = None
        if total_submissions > 0:
            acceptance_rate = round((total_solved / total_submissions) * 100, 2)
        
        return {
            "username": username,
            "name": profile.get("realName"),
            "avatar_url": profile.get("userAvatar"),
            "ranking": profile.get("ranking"),
            "reputation": profile.get("reputation"),
            "about": profile.get("aboutMe"),
            "country": profile.get("countryName"),
            "company": profile.get("company"),
            "school": profile.get("school"),
            "problems_solved": total_solved,
            "easy_solved": easy_solved,
            "medium_solved": medium_solved,
            "hard_solved": hard_solved,
            "total_submissions": total_submissions,
            "submissions_by_difficulty": total_stats_by_difficulty,
            "acceptance_rate": acceptance_rate,
            "profile_url": f"https://leetcode.com/u/{username}/"
        }
    except Exception as e:
        print(f"Error fetching LeetCode data: {e}")
        return {
            "username": username,
            "error": str(e)
        }


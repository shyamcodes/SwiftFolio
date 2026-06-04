from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class GitHubData(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_repos: int = 0
    followers: int = 0
    following: int = 0
    repos: List[Dict[str, Any]] = []


class LeetCodeData(BaseModel):
    username: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    ranking: Optional[int] = None
    reputation: Optional[int] = None
    problems_solved: int = 0
    easy_solved: int = 0
    medium_solved: int = 0
    hard_solved: int = 0
    total_submissions: int = 0
    submissions_by_difficulty: Dict[str, int] = {}
    acceptance_rate: Optional[float] = None
    about: Optional[str] = None
    country: Optional[str] = None
    company: Optional[str] = None
    school: Optional[str] = None
    profile_url: Optional[str] = None


class HackerRankData(BaseModel):
    username: str
    problems_solved: int = 0
    badges: List[str] = []
    certificates: List[str] = []
    leaderboard_rank: Optional[int] = None


class ResumeData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    education: List[Dict[str, str]] = []
    experience: List[Dict[str, str]] = []
    skills: List[str] = []


class PortfolioBase(BaseModel):
    username: str
    about: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    language: str = "en"  # Default language: English


class PortfolioCreate(PortfolioBase):
    resume: Optional[str] = None  # base64 encoded
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    hackerrank_username: Optional[str] = None


class GeneratedContent(BaseModel):
    about: str
    bio: str
    skills_summary: str
    project_descriptions: List[Dict[str, str]]


class Portfolio(PortfolioBase):
    id: str
    user_id: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None
    github_data: Optional[Dict[str, Any]] = None
    leetcode_data: Optional[Dict[str, Any]] = None
    hackerrank_data: Optional[Dict[str, Any]] = None
    generated_content: Optional[Dict[str, Any]] = None
    language: str = "en"
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    username: str
    about: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    resume: Optional[ResumeData] = None
    github: Optional[Dict[str, Any]] = None
    leetcode: Optional[Dict[str, Any]] = None
    hackerrank: Optional[Dict[str, Any]] = None
    last_updated: datetime


class GenerateRequest(BaseModel):
    username: str
    resume: Optional[str] = None  # base64 encoded PDF
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    hackerrank_username: Optional[str] = None


class GenerateResponse(BaseModel):
    portfolio_id: str
    username: str
    status: str


class PortfolioEditRequest(BaseModel):
    about: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    language: Optional[str] = None


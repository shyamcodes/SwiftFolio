import pdfplumber
import io
import base64
import re
from typing import Dict, List, Optional


def parse_resume_from_base64(base64_string: str) -> Dict:
    """Parse resume from base64 encoded PDF"""
    try:
        # Decode base64
        pdf_bytes = base64.b64decode(base64_string)
        pdf_file = io.BytesIO(pdf_bytes)
        
        # Extract text using pdfplumber
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        
        # Parse extracted text
        return parse_resume_text(text)
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return {
            "name": None,
            "email": None,
            "phone": None,
            "education": [],
            "experience": [],
            "skills": []
        }


def parse_resume_text(text: str) -> Dict:
    """Parse resume text to extract structured information"""
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    email = email_match.group(0) if email_match else None
    
    # Extract phone
    phone_pattern = r'(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}'
    phone_match = re.search(phone_pattern, text)
    phone = phone_match.group(0) if phone_match else None
    
    # Extract name (usually first line or first substantial line)
    lines = text.split('\n')
    name = None
    for line in lines[:5]:
        line = line.strip()
        if line and len(line) < 50 and not '@' in line:
            # Likely a name - no special characters, reasonable length
            if re.match(r'^[A-Za-z\s\.]+$', line):
                name = line
                break
    
    # Extract skills (look for common patterns)
    skills = extract_skills(text)
    
    # Extract education (simplified)
    education = extract_education(text)
    
    # Extract experience (simplified)
    experience = extract_experience(text)
    
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "education": education,
        "experience": experience,
        "skills": skills
    }


def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text"""
    # Common programming languages, frameworks, tools
    skill_keywords = [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Ruby", "Go", "Rust",
        "Swift", "Kotlin", "PHP", "SQL", "HTML", "CSS", "React", "React Native", "Angular",
        "Vue", "Node.js", "Django", "Flask", "FastAPI", "Spring", "Rails", "Express",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Docker", "Kubernetes",
        "AWS", "Azure", "GCP", "Git", "CI/CD", "Jenkins", "Linux", "Machine Learning",
        "Deep Learning", "Data Science", "NLP", "Computer Vision", "TensorFlow", "PyTorch",
        "Pandas", "NumPy", "Scikit-learn", "GraphQL", "REST API", "Microservices",
        "Agile", "Scrum", "TDD", "OOP", "Design Patterns"
    ]
    
    found_skills = []
    text_upper = text.upper()
    
    for skill in skill_keywords:
        if skill.upper() in text_upper:
            found_skills.append(skill)
    
    return list(set(found_skills))


def extract_education(text: str) -> List[Dict[str, str]]:
    """Extract education information"""
    education = []
    
    # Look for common education keywords
    edu_keywords = ["University", "College", "Institute", "Bachelor", "Master", "PhD", "B.Sc", "M.Sc", "B.E", "M.E"]
    
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if any(keyword.lower() in line.lower() for keyword in edu_keywords):
            education.append({
                "degree": line.strip(),
                "details": lines[i+1].strip() if i+1 < len(lines) else ""
            })
    
    return education[:3]  # Limit to 3 entries


def extract_experience(text: str) -> List[Dict[str, str]]:
    """Extract experience information"""
    experience = []
    
    # Look for common experience keywords
    exp_keywords = ["Experience", "Work", "Internship", "Software Engineer", "Developer", "Designer"]
    
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if any(keyword.lower() in line.lower() for keyword in exp_keywords):
            if len(line) < 100:  # Reasonable title length
                experience.append({
                    "title": line.strip(),
                    "details": lines[i+1].strip() if i+1 < len(lines) else ""
                })
    
    return experience[:5]  # Limit to 5 entries


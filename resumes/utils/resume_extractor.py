import re
from typing import Dict, List
from resumes.models import ResumeSkill


def extract_sections(raw_text: str) -> Dict[str, List[str]]:
    sections = {
        "education": [],
        "experience": [],
        "projects": [],
        "skills": [],
        "others": []
    }

    lines = [ln.strip() for ln in raw_text.splitlines() if ln.strip()]
    current_section = "others"

    section_keywords = {
        "education": ["education", "academic", "qualification"],
        "experience": ["experience", "internship", "work history", "employment"],
        "projects": ["projects", "research work"],
        "skills": ["skills", "technical skills", "technologies", "languages"]
    }

    for line in lines:
        lower_line = line.lower()
        matched_section = None
        for section, keywords in section_keywords.items():
            if any(kw in lower_line for kw in keywords):
                matched_section = section
                break

        if matched_section:
            current_section = matched_section
        else:
            sections[current_section].append(line)

    return sections


def parse_education(lines: List[str]) -> List[Dict]:
    edu_list = []
    year_pattern = re.compile(r'(\b(19|20)\d{2}\b)(?:\s*[-to]+\s*(\b(19|20)\d{2}\b|Present))?', re.I)

    for line in lines:
        degree = None
        institution = None
        start_year = None
        end_year = None

        years_match = year_pattern.search(line)
        if years_match:
            start_year = years_match.group(1)
            end_year = years_match.group(3) if years_match.group(3) else None

        degree_match = re.search(
            r'(bachelor|master|doctorate|ph\.?d\.?|b\.tech|m\.tech|b\.sc|m\.sc|b\.e|m\.e|mba|b\.comm|m\.comm|diploma)', 
            line, re.I)
        if degree_match:
            degree = degree_match.group(0).title()

        cleaned_line = year_pattern.sub('', line, count=1).strip()
        if degree:
            cleaned_line = cleaned_line.replace(degree_match.group(0), '').strip()

        institution = cleaned_line if cleaned_line else None

        edu_list.append({
            "degree": degree,
            "institution": institution,
            "start_year": start_year,
            "end_year": end_year
        })

    return edu_list


def parse_experience(lines: List[str]) -> List[Dict]:
    exp_list = []

    duration_pattern = re.compile(r'(?:\b(19|20)\d{2}\b(?:\s*[-to]+\s*\b(19|20)\d{2}\b|Present)?)', re.I)

    for line in lines:
        role = None
        organization = None
        duration = None

        duration_match = duration_pattern.search(line)
        if duration_match:
            duration = duration_match.group(0)

        if ' at ' in line.lower():
            parts = re.split(r'\bat\b', line, flags=re.I)
            role = parts[0].strip()
            org_part = parts[1].strip()
            org_and_duration = re.split(r',| - ', org_part)
            if len(org_and_duration) > 1:
                organization = org_and_duration[0].strip()
            else:
                organization = org_part
        else:
            parts = line.split(',')
            if len(parts) == 2:
                role = parts[0].strip()
                organization = parts[1].strip()
            else:
                role = line.strip()

        exp_list.append({
            "role": role,
            "organization": organization,
            "duration": duration
        })

    return exp_list


def parse_skills(lines: List[str]) -> List[str]:
    skills = []
    for line in lines:
        parts = re.split(r'[;,|]', line)
        for skill in parts:
            skill_clean = skill.strip()
            if skill_clean:
                skills.append(skill_clean)
    return list(set(skills))


def extract_skills_from_text(raw_text: str) -> List[str]:
    """
    Extract skills block from raw text if skills not found in sections.
    """
    match = re.search(r'(?:Skills|Technical Skills)(.*?)(?:\n\n|$)', raw_text, re.IGNORECASE | re.DOTALL)
    if match:
        skills_block = match.group(1)
        skills = re.split(r'[;,|\n]', skills_block)
        return [s.strip() for s in skills if s.strip()]
    return []


def parse_projects(lines: List[str]) -> List[Dict]:
    projects = []
    current_project = None

    for line in lines:
        if re.match(r'^[-\*•]\s*(.+)', line):
            if current_project:
                projects.append(current_project)
            title = re.sub(r'^[-\*•]\s*', '', line).strip()
            current_project = {"title": title, "description": ""}
        elif line.isupper() and len(line.split()) <= 6:
            if current_project:
                projects.append(current_project)
            current_project = {"title": line.strip(), "description": ""}
        else:
            if current_project:
                if current_project["description"]:
                    current_project["description"] += " " + line.strip()
                else:
                    current_project["description"] = line.strip()

    if current_project:
        projects.append(current_project)

    return projects


def structured_resume(parsed_json: Dict) -> Dict:
    raw_text = parsed_json.get("raw_text", "")
    sections = extract_sections(raw_text)

    education = parse_education(sections["education"])
    experience = parse_experience(sections["experience"])
    skills = parse_skills(sections["skills"])

    # Fallback: extract skills from raw text if none found in section
    if not skills:
        skills = extract_skills_from_text(raw_text)

    projects = parse_projects(sections["projects"])

    structured = {
        "education": education,
        "experience": experience,
        "projects": projects,
        "skills": skills,
        "others": sections["others"],
        "meta": parsed_json.get("meta", {}),
        "text_length": parsed_json.get("text_length", 0)
    }

    return structured

# print(ResumeSkill.objects.all())
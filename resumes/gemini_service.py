import google.generativeai as genai
import os

# Configure API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def ask_gemini(question: str) -> str:
    try:
        # ✅ Use new model name
        model = genai.GenerativeModel("gemini-1.5-flash")  # or "gemini-1.5-pro"
        
        response = model.generate_content(question)

        return response.candidates[0].content.parts[0].text
    except Exception as e:
        return f"Error: {str(e)}"

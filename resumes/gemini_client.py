import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_gemini_model():
    return genai.GenerativeModel("gemini-pro")

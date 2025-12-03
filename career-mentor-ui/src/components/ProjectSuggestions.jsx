import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosInstance";
import ReactMarkdown from "react-markdown";

const ProjectSuggestions = ({ missingSkills, jobGoal }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = useCallback(async () => {
    if (!missingSkills || missingSkills.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/resume/project-suggest/", {
        missing_skills: missingSkills,
        job_goal: jobGoal,
      });
      setProjects(response.data.project_suggestions || []);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch project suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [missingSkills, jobGoal]);

  // Auto-fetch when missingSkills changes
  useEffect(() => {
    if (missingSkills && missingSkills.length > 0) {
      fetchSuggestions();
    }
  }, [fetchSuggestions, missingSkills]);

  return (
    <div style={{ margin: "30px", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ color: "#222", marginBottom: "10px" }}>
        💡 Personalized Project Suggestions
      </h2>
      <button
        onClick={fetchSuggestions}
        disabled={loading || !missingSkills || missingSkills.length === 0}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "15px",
        }}
      >
        {loading ? "⏳ Generating suggestions..." : "🔁 Refresh Suggestions"}
      </button>

      {error && (
        <div
          style={{
            color: "red",
            background: "#ffeaea",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <div>Generating personalized project ideas...</div>
        ) : projects.length > 0 ? (
          projects.map((proj) => (
            <div
              key={proj.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                margin: "15px 0",
                padding: "20px",
                background: "#fafafa",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "5px", color: "#333" }}>
                {proj.title}
              </h3>
              <p style={{ color: "#555", fontSize: "0.95rem" }}>
                {proj.description}
              </p>

              {proj.readme && (
                <details
                  style={{
                    marginTop: "10px",
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      fontWeight: "500",
                      marginBottom: "5px",
                    }}
                  >
                    📘 View Project Details (README)
                  </summary>
                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "10px 15px",
                      borderRadius: "6px",
                      overflowX: "auto",
                      fontSize: "0.9rem",
                    }}
                  >
                    <ReactMarkdown>{proj.readme}</ReactMarkdown>
                  </div>
                </details>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              color: "#666",
              fontStyle: "italic",
              background: "#f3f3f3",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            No suggestions yet. Upload a resume and analyze a job description
            first.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSuggestions;

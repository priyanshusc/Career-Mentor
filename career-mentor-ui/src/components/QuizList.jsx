import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const QuizList = ({ skill }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorQuiz, setErrorQuiz] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (skill) {
      setErrorQuiz("");
      fetchQuestions(skill);
    }
  }, [skill]);

  const fetchQuestions = async (sk) => {
    setLoading(true);
    setErrorQuiz("");
    try {
      // resumes app is mounted under /resume/ so prefix paths accordingly
      const response = await axios.get("/resume/quizzes/list/", { params: { skill: sk } });
      setQuestions(response.data.questions || []);
      setCurrentQIndex(0);
      setFinished(false);
      setFeedback(null);
      setSelectedOption("");
    } catch (err) {
      console.error("Failed to fetch quiz questions", err);
      const message = err.response?.data?.detail || err.message || "Failed to fetch quiz questions";
      setErrorQuiz(message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption) return alert("Please select an option");

    const question = questions[currentQIndex];
    setLoading(true);
    try {
      const response = await axios.post("/resume/quizzes/attempt/", {
        quiz_question_id: question.id,
        selected_option: selectedOption,
      });
      setFeedback({
        correct: response.data.correct,
        explanation: response.data.explanation,
      });
    } catch (err) {
      console.error("Failed to submit answer", err);
      const message = err.response?.data?.detail || "Failed to submit answer";
      setFeedback({ error: message });
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption("");
      setFeedback(null);
    } else {
      setFinished(true);
    }
  };

  // Render inline states so the parent layout remains stable
  if (loading && questions.length === 0) return <div className="p-4 text-center">Loading quiz questions...</div>;
  if (errorQuiz) return (
    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
      <p className="font-medium">Could not load questions: {errorQuiz}</p>
      <div className="mt-2">
        <button onClick={() => fetchQuestions(skill)} className="px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
      </div>
    </div>
  );
  if (!loading && questions.length === 0) return (
    <div className="p-4 text-center text-gray-600">No quiz questions available for this skill.</div>
  );

  if (finished) return <div>Quiz Finished! Well done.</div>;

  const question = questions[currentQIndex];

  return (
    <div className="quiz-container">
      <h3>Question {currentQIndex + 1} of {questions.length}</h3>
  <p className="mb-4" dangerouslySetInnerHTML={{ __html: question.question }} />
      <form>
        {Object.entries(question.options).map(([key, option]) => (
          <label key={key} className="quiz-option">
            <input
              type="radio"
              name="option"
              value={key}
              checked={selectedOption === key}
              onChange={() => setSelectedOption(key)}
            />
            <span>{option}</span>
          </label>
        ))}
      </form>

      {feedback && (
        <div className={`feedback ${feedback.correct ? "correct" : "incorrect"}`}>
          {feedback.correct ? "Correct!" : "Incorrect."}
          {feedback.explanation && <p className="explanation">{feedback.explanation}</p>}
          {feedback.error && <p className="error">{feedback.error}</p>}
        </div>
      )}

      {!feedback && (
        <button onClick={submitAnswer} disabled={!selectedOption || loading} className={`px-4 py-2 rounded ${(!selectedOption || loading) ? 'bg-gray-400' : 'bg-green-600 text-white'}`}>
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      )}

      {feedback && !finished && (
        <button onClick={nextQuestion} >
          Next Question
        </button>
      )}
    </div>
  );
};

export default QuizList;

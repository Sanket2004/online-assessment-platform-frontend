import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "./ui/button"; // Import your button component
import { Input } from "./ui/input"; // Import your input component
import { Textarea } from "./ui/textarea"; // Import your textarea component
import { Alert } from "./ui/alert"; // Import your alert component if needed
import { Loader, Trash, Trash2Icon } from "lucide-react";
import { useUser } from "./UserContext";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", ""], answer: "" },
  ]);
  const navigate = useNavigate();
  const { user } = useUser(); // Get user from context
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    if (Array.isArray(value)) {
      newQuestions[questionIndex].options = value;
    } else {
      newQuestions[questionIndex].options[optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], answer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/tests`, {
        title,
        description,
        questions,
        createdBy: user?._id,
        duration,
      });
      alert("Test created successfully!");
      // navigate(`/tests/${response.data._id}`); // Redirect to the test details page
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      alert("Error creating test: " + message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have successfully logged out.");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold ">Create new assessment</h1>
        <p className="text-gray-400 mb-8">
          Assessment is a way to assess someone's ability and efficiency.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Assessment Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Quantitive Aptitude"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Assessment Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Compnacy specific aptitude test..."
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Assessment Duration
            </label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="In minutes ( e.g. 60 )"
            />
          </div>

          {questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-semibold mb-4">Question {index + 1}</h3>
              <div>
                <label className="block font-medium mb-2">Question Text</label>
                <Textarea
                  type="text"
                  name="questionText"
                  className="mb-2"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Options</label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mb-2">
                    <Input
                      type="text"
                      value={option}
                      className="flex-1 mr-2"
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    {question.options.length > 2 && ( // Show Remove Option button only if there are more than two options
                      <Button
                        type="button"
                        onClick={() => {
                          const newOptions = question.options.filter(
                            (_, i) => i !== optionIndex
                          );
                          handleOptionChange(index, optionIndex, newOptions);
                        }}
                        variant="outline"
                      >
                        <Trash2Icon size={15} className="text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    handleOptionChange(index, question.options.length, "")
                  }
                >
                  Add Option
                </Button>
              </div>
              <div className="mb-2 mt-2">
                <label className="block font-medium mb-2">Correct Answer</label>
                <Input
                  type="text"
                  name="answer"
                  className="mb-2"
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                />
              </div>
              {questions.length > 1 && ( // Change here to check if there's more than one question
                <Button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  variant="outline"
                >
                  Remove Question
                </Button>
              )}
            </div>
          ))}
          <div className="flex gap-4 max-w-72">
            <Button
              type="button"
              className="w-full flex-1"
              onClick={handleAddQuestion}
            >
              +
            </Button>
            <Button type="submit" className="w-full">
              {loading ? (
                <Loader className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Create Assessment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTest;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "./UserContext";
import Navbar from "./Navbar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import LoadingSpinner from "./LoadingSpinner";

const TestAttempt = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state for the current question index
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [attemptedAt, setAttemptedAt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${backendUrl}/tests/${id}`);
        setTest(response.data);
        const initialAnswers = response.data.questions.map((question) => ({
          questionId: question._id,
          selectedOption: "",
        }));
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Error fetching test:", error);
        setError("Error fetching test. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPreviousAttempt = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${backendUrl}/tests/attempt/${user._id}/${id}`
          );
          if (response.data) {
            const previousAnswers = response.data.answers.map((answer) => ({
              questionId: answer.questionId,
              selectedOption: answer.selectedOption,
            }));
            setPreviousScore(response.data.score);
            setAttemptedAt(response.data.timeStamp); // Set the attempted time
            setAnswers(previousAnswers);
            setHasAttempted(true);
          }
        } catch (error) {
          console.error("Error fetching previous attempt:", error);
        }
      }
    };

    fetchTest();
    fetchPreviousAttempt();
  }, [id, user]);

  useEffect(() => {
    if (testStarted) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            handleSubmit(); // Automatically submit when time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setTimerId(timer);

      return () => clearInterval(timer);
    }
  }, [testStarted]);

  useEffect(() => {
    if (testStarted) {
      // Prevent page reload or navigating away
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ""; // Some browsers require this property to be set
      };

      // Warn when the user attempts to switch tabs or lose focus
      const handleVisibilityChange = () => {
        if (document.hidden) {
          alert("You cannot switch tabs during the test.");
          handleSubmit();
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [testStarted]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOption }
          : answer
      )
    );
  };

  const handleStartTest = (e) => {
    e.preventDefault();
    setRemainingTime(test.duration * 60);
    setTestStarted(true);
    enterFullscreen();
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      alert("You must be logged in to attempt a test");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/tests/attempt`, {
        userId: user._id,
        testId: id,
        answers,
      });
      alert(`Test submitted! Your score: ${response.data.score}`);
      setTestStarted(false); // Hide the submit button after submission
      setHasAttempted(true); // Mark the test as attempted
      setPreviousScore(response.data.score); // Update the previous score state
      exitFullscreen(); // Exit full-screen mode after submission
    } catch (error) {
      console.error("Error submitting test:", error);
      setError(
        "Failed to submit test. " +
          (error.response?.data.message || "Please try again.")
      );
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, test.questions.length - 1)
    );
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  if (loading) return <LoadingSpinner />;
  if (!test) return <p>Test not found.</p>;

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="mx-auto px-6 py-8 max-w-6xl">
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-semibold text-secondary font-mono">
                {test.title}
              </h1>
              <p className="text-primary whitespace-pre-wrap break-words">
                {test.description}
              </p>
              <p className="whitespace-pre-wrap break-words text-gray-500 mt-2 font-semibold">
                Duration: {test.duration} mins
              </p>
              <p className="text-gray-400 text-xs">
                {new Date(test.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="md:text-right space-y-2 md:space-y-0">
              {!hasAttempted && testStarted && (
                <p className="text-red-600 font-bold text-lg">
                  <span className="inline-block lg:hidden md:hidden me-2">
                    Time Left:
                  </span>
                  {Math.floor(remainingTime / 60)}:
                  {String(remainingTime % 60).padStart(2, "0")}
                </p>
              )}
              {!hasAttempted && !testStarted && (
                <Button onClick={handleStartTest} className="w-full">
                  Start Test
                </Button>
              )}
              <form onSubmit={handleSubmit}>
                {testStarted && (
                  <Button
                    onClick={handleSubmit}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
                  >
                    Submit Test
                  </Button>
                )}
              </form>
            </div>
          </div>
        </CardHeader>

        <Separator className="mb-6 w-[98%] mx-auto" />

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!testStarted && !hasAttempted && (
            <p className="text-gray-600 font-mono">
              Click "Start Test" to begin the exam.
            </p>
          )}

          {testStarted && currentQuestion && (
            <div key={currentQuestion._id} className="mb-4">
              <h3 className="text-base text-gray-800 mb-3 whitespace-pre-wrap break-words font-semibold">
                <span>{currentQuestionIndex + 1} . </span>
                {currentQuestion.questionText}
              </h3>
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <div key={`${currentQuestion._id}-${option}`}>
                    <Label>
                      <RadioGroup
                        onValueChange={(value) =>
                          handleOptionChange(currentQuestion._id, value)
                        }
                        value={
                          answers.find(
                            (answer) =>
                              answer.questionId === currentQuestion._id
                          )?.selectedOption
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`${currentQuestion._id}-${option}`}
                            className="h-4 w-4 border-gray-300"
                          />
                          <label
                            htmlFor={`${currentQuestion._id}-${option}`}
                            className="text-sm text-gray-600 whitespace-pre-wrap"
                          >
                            {option}
                          </label>
                        </div>
                      </RadioGroup>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous and Next Buttons */}
          {testStarted && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentQuestionIndex === 0
                    ? "cursor-default bg-gray-400 text-gray-600 pointer-events-none"
                    : "bg-secondary text-white hover:bg-green-800"
                }`}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === test.questions.length - 1}
                className={`px-4 py-2 rounded-lg ${
                  currentQuestionIndex === test.questions.length - 1
                    ? "cursor-default bg-gray-400 text-gray-600 pointer-events-none"
                    : "bg-secondary text-white hover:bg-green-700"
                }`}
              >
                Next
              </Button>
            </div>
          )}

          {hasAttempted && (
            <div className=" flex flex-wrap justify-between gap-y-2">
              <Alert>
                <ExclamationTriangleIcon />
                <AlertTitle className="font-mono font-semibold">
                  Assessment Already Attempted!
                </AlertTitle>
                <AlertDescription>
                  You have already attempted this assessment at{" "}
                  {attemptedAt && new Date(attemptedAt).toLocaleString()}. Your
                  previous score: {previousScore}/{test.questions.length}
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate("/")}>Back</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAttempt;

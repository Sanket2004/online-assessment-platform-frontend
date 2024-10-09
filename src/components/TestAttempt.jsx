import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  const [remainingTime, setRemainingTime] = useState(0); // State for remaining time
  const [timerId, setTimerId] = useState(null); // State to store the timer ID
  const [testStarted, setTestStarted] = useState(false); // State to track if the test has started
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/tests/${id}`
        );
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
      // Start the timer
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            handleSubmit(); // Automatically submit when time runs out
            return 0;
          }
          return prevTime - 1; // Decrease remaining time by 1 second
        });
      }, 1000);

      setTimerId(timer); // Save the timer ID

      return () => clearInterval(timer); // Cleanup timer on component unmount
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
    e.preventDefault(); // Prevent default form submission
    setRemainingTime(test.duration * 60); // Set the remaining time to the duration of the test
    setTestStarted(true);
    enterFullscreen(); // Enter full-screen mode
  };

  const enterFullscreen = () => {
    const element = document.documentElement; // Fullscreen the entire document
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
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
      const response = await axios.post(
        `${backendUrl}/tests/attempt`,
        {
          userId: user._id,
          testId: id,
          answers,
        }
      );
      alert(`Test submitted! Your score: ${response.data.score}`);
      setTestStarted(false); // Set to false to hide the submit button after submission
      setHasAttempted(true); // Mark the test as attempted
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

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      handleSubmit(); // Automatically submit when exiting full-screen
    }
  };

  useEffect(() => {
    // Add event listener for fullscreen change
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      // Cleanup event listeners on component unmount
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!test) return <p>Test not found.</p>;

  return (
    <>
      <Navbar />
      <div className="mx-auto px-6 py-8 max-w-6xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left section: Title, description, and creation date */}
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {test.title}
                  </h1>
                  <p className="text-gray-600 whitespace-pre-wrap break-words">
                    {test.description}
                  </p>
                  <p className=" whitespace-pre-wrap break-words text-gray-500 mt-2 font-semibold">
                    Duration: {test.duration} mins
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(test.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right section: Timer, start and submit buttons */}
                <div className="text-center md:text-right space-y-2 md:space-y-0">
                  {!hasAttempted && testStarted && (
                    <p className="text-red-600 font-bold text-xl">
                      {Math.floor(remainingTime / 60)}:
                      {String(remainingTime % 60).padStart(2, "0")}
                    </p>
                  )}
                  {!hasAttempted && !testStarted && (
                    <Button onClick={handleStartTest} className="w-full">
                      Start Test
                    </Button>
                  )}
                  {testStarted && (
                    <Button
                      onClick={handleSubmit}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
                    >
                      Submit Test
                    </Button>
                  )}
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

              {test.questions.map((question, index) => (
                <div key={question._id} className="mb-4">
                  <h3 className="text-base font-medium text-gray-800 mb-3 whitespace-pre-wrap break-words">
                    <span>{index + 1} . </span>
                    {question.questionText}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={`${question._id}-${option}`}>
                        <Label>
                          <RadioGroup
                            onValueChange={(value) =>
                              handleOptionChange(question._id, value)
                            }
                            value={
                              answers.find(
                                (answer) => answer.questionId === question._id
                              )?.selectedOption
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={option}
                                id={`${question._id}-${option}`}
                                className="h-4 w-4 border-gray-300"
                              />
                              <label
                                htmlFor={`${question._id}-${option}`}
                                className="text-sm text-gray-700 whitespace-pre-wrap"
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
              ))}

              {hasAttempted && ( // Show previous score if already attempted
                <>
                  <p className="text-green-600 font-medium">
                    You have already attempted this assessment.
                  </p>
                  <p className="text-green-600">
                    Your Previous Score: {previousScore}/{test.questions.length}
                  </p>
                </>
              )}
            </CardContent>
          </form>
        </Card>
      </div>
    </>
  );
};

export default TestAttempt;

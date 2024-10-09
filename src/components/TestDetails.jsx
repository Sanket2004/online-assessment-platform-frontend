import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon, CheckIcon } from "@radix-ui/react-icons";
import { CheckCircle2Icon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const TestDetail = () => {
  const { id } = useParams(); // Get the test ID from the URL
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${backendUrl}/tests/${id}`);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching test:", error);
        setError("Error fetching test. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!test) return <p>Test not found.</p>;

  return (
    <>
      <Navbar />
      <div className="mx-auto px-6 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            {/* Test Title and Description */}
            <h1 className="text-2xl font-semibold text-gray-800">
              {test.title}
            </h1>
            <p className="text-gray-600">{test.description}</p>
            <p className="text-gray-400 text-xs">
              {new Date(test.createdAt).toLocaleString()}
            </p>
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

            {/* Render Test Questions and Options */}
            <ul>
              {test.questions.map((question, index) => (
                <li key={question._id} className="mb-4">
                  <h3 className="text-base font-medium text-gray-800 mb-3">
                    <span>{index + 1} . </span>
                    {question.questionText}
                  </h3>
                  <ul className="space-y-2 pl-6">
                    {question.options.map((option, index) => (
                      <li
                        key={index}
                        className="text-gray-500 list-inside list-disc"
                      >
                        {option}
                      </li>
                    ))}
                    <li className="list-disc list-inside text-green-500">
                      {question.answer}
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TestDetail;

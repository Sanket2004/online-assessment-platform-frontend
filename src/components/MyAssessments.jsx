import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import Navbar from "./Navbar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import LoadingSpinner from "./LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { Loader } from "lucide-react";

const MyAssessments = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState({}); // Track loading per assessment
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) {
        return; // No user logged in
      }

      try {
        const response = await axios.get(
          `${backendUrl}/tests/attempts/${user._id}`
        );

        if (response.data.attempts.length === 0) {
          setAssessments([]); // Handle no attempts case
        } else {
          setAssessments(response.data.attempts);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setError("Failed to load assessments. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load assessments. Please try again.",
          variant: "destructive", // Show error only if it's a real error
        });
      }
    };

    fetchAssessments();
  }, [user, backendUrl]);

  const downloadCertificate = async (
    userId,
    score,
    totalQuestions,
    testTitle,
    assessmentId
  ) => {
    try {
      setLoadingAssessments((prev) => ({
        ...prev,
        [assessmentId]: true, // Set loading state for this assessment
      }));

      const passingScore = Math.ceil(totalQuestions / 2); // Calculate passing score as 50%

      if (score >= passingScore) {
        const response = await axios.get(
          `${backendUrl}/certificate/${userId}/${score}/${totalQuestions}/${testTitle}`,
          {
            responseType: "blob",
          }
        );

        // Create a URL for the PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `certificate-${userId}.pdf`); // Set file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast({
          title: "Success",
          description: "Certificate has been downloaded successfully.",
        });
      } else {
        alert(
          "You need to achieve a passing score of 50% to download the certificate."
        );
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Error Downloading Certificate",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAssessments((prev) => ({
        ...prev,
        [assessmentId]: false, // Reset loading state for this assessment
      }));
    }
  };

  // Filter assessments based on search term
  const filteredAssessments = assessments.filter((assessment) =>
    assessment.testId?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster />
      <Navbar showSearchBar={true} setSearchTerm={setSearchTerm} />
      <div className="mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold font-mono">My Assessments</h1>
        <p className="text-gray-400 mb-10">
          The assessments you have appeared for.
        </p>

        {error ? (
          <p className="text-red-500">{error}</p> // Display error only if setError has been called
        ) : (
          <>
            {assessments.length === 0 ? (
              <p className="text-gray-600">
                You have not appeared for any assessments yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {assessments.map((assessment) => {
                  const isLoading = loadingAssessments[assessment._id];

                  return (
                    <Card
                      key={assessment._id}
                      className="flex justify-between items-start flex-wrap gap-y-2"
                    >
                      <CardHeader className="pb-0 md:pb-6">
                        <h2 className="font-semibold text-xl font-mono">
                          {assessment.testId
                            ? assessment.testId.title
                            : "Test not found"}
                        </h2>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(assessment.timeStamp).toLocaleString()}
                        </p>
                      </CardHeader>
                      <CardContent
                        className={
                          assessment.score >=
                          Math.ceil(assessment.testId?.questions.length / 2)
                            ? "p-6 pt-0 md:pt-6"
                            : "p-6 md:pt-6"
                        }
                      >
                        <div className="flex flex-col gap-2 md:items-end">
                          <p className="text-gray-600 text-sm">
                            Score: {assessment.score} out of{" "}
                            {assessment.testId?.questions?.length || 0}
                          </p>
                          {assessment.score >=
                          Math.ceil(assessment.testId?.questions.length / 2) ? (
                            <Button
                              onClick={() =>
                                downloadCertificate(
                                  assessment.userId,
                                  assessment.score,
                                  assessment.testId?.questions.length,
                                  assessment.testId?.title,
                                  assessment._id
                                )
                              }
                              disabled={isLoading}
                              className="flex items-center justify-center min-w-[150px] px-4 py-2"
                            >
                              {isLoading ? (
                                <Loader className="h-5 w-5 animate-spin text-white" />
                              ) : (
                                "Download Certificate"
                              )}
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                      {assessment.score >=
                      Math.ceil(assessment.testId?.questions.length / 2) ? (
                        <Alert className="rounded-lg bg-secondary text-white">
                          <AlertTitle className="font-mono font-semibold">
                            Qualified!
                          </AlertTitle>
                          <AlertDescription>
                            Congratulations! You have passed in this test.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert
                          className="rounded-lg bg-destructive text-white"
                          variant={"destructive"}
                        >
                          <AlertTitle className="font-mono font-semibold">
                            Not Qualified!
                          </AlertTitle>
                          <AlertDescription>
                            You need to achieve a passing score of 50% to
                            download the certificate.
                          </AlertDescription>
                        </Alert>
                      )}
                    </Card>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyAssessments;

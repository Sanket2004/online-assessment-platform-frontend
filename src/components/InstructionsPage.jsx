import React from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const InstructionsPage = () => {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="mx-auto px-6 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">
              How to give the exam
            </h1>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li className="list-inside">
                <strong>Enter Full-Screen Mode:</strong> When you start the
                exam, you will be prompted to enter full-screen mode. This is to
                minimize distractions and ensure a focused exam environment.
              </li>
              <li>
                <strong>Time Management:</strong> Keep an eye on the timer
                displayed on your screen. Make sure to complete your exam before
                the time runs out.
              </li>
              <li>
                <strong>Exiting Full-Screen Mode:</strong> If you exit
                full-screen mode for any reason, the test will automatically be
                submitted to ensure exam integrity.
              </li>
              <li>
                <strong>Submitting the Exam:</strong> Once you finish the exam
                or if the timer runs out, your answers will be automatically
                submitted.
              </li>
              <li>
                <strong>Reviewing Results:</strong> After submission, you will
                receive your results via email. You can review your performance
                and feedback as provided.
              </li>
            </ol>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button onClick={() => navigate('/')}>
            I'm ready
          </Button>
        </div>
      </div>
    </>
  );
};

export default InstructionsPage;

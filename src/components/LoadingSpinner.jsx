// LoadingSpinner.js
import React from "react";
import { Loader } from "lucide-react"; // Using the Loader icon from lucide-react

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;

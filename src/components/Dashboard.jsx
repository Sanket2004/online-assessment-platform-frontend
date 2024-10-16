// Dashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";
import { PersonIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";


const Dashboard = () => {
  const { user } = useUser();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${backendUrl}/tests`);
        setTests(response.data);
      } catch (err) {
        setError("Failed to fetch tests. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen w-full">
      <Navbar showSearchBar={true} setSearchTerm={setSearchTerm} />
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-black whitespace-pre-wrap break-all font-mono">
            Available Assessments
          </h1>
        </div>
        <p className="text-md text-gray-500 mb-10 capitalize whitespace-pre-wrap break-all font-light">
          Welcome, {user?.name.split(" ")[0]}
        </p>

        {filteredTests.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tests available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTests.map((test) => (
              <Link key={test._id} to={`/test/${test._id}`} className="group">
                <Card className="hover:shadow-lg transition-all duration-150">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold whitespace-pre-wrap break-all font-mono text-secondary">
                      {test.title}
                    </CardTitle>
                    <CardDescription className="whitespace-pre-wrap break-all text-primary">{test.description}</CardDescription>
                  </CardHeader>
                  <Separator className="mb-6 max-w-[95%] mx-auto"/>
                  <CardFooter className="text-xs flex flex-col justify-start items-start">
                    <div className="flex gap-2 items-center mb-4">
                      <PersonIcon height={30} width={30} className="bg-gray-200 p-1.5 rounded-lg"/>
                      <div className="">
                        <p className="text-xs text-gray-600 font-bold capitalize">
                          {test.createdBy?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {test.createdBy?.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Published at {new Date(test.createdAt).toLocaleString()}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

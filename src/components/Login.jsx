import React, { useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext"; // Import user context
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button"; // Shadcn Button
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"; // Shadcn Card
import { Input } from "./ui/input"; // Shadcn Input
import { Label } from "./ui/label"; // Shadcn Label
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"; // Shadcn alert
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message
  const { setUser } = useUser();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      //   alert("Login successful!");
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      setError("Invalid credentials. Please try again."); // Set error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-mono">Login</CardTitle>
          <CardDescription>
            Enter your Email and password to log in to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle className="font-mono font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            {loading ? (
              <Loader className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to={"/register"} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

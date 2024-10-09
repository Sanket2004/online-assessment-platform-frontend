import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleUser, Menu, CpuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";

const Navbar = ({ showSearchBar, setSearchTerm }) => {
  const location = useLocation(); // Get the current location from React Router
  const navigate = useNavigate();
  
  // Set the active link based on the current location
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname); // Update active link on route change
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have successfully logged out.");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 text-nowrap">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <CpuIcon className="h-6 w-6" />
          <span className="sr-only">Assessment App</span>
        </Link>
        <Link
          to="/"
          className={`hover:text-foreground w-max transition-all duration-150 ${
            activeLink === "/" ? "text-foreground border-b-4" : "text-muted-foreground"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/create-test"
          className={`hover:text-foreground w-max transition-all duration-150 ${
            activeLink === "/create-test" ? "text-foreground border-b-4" : "text-muted-foreground"
          }`}
        >
          Create Assessment
        </Link>
        <Link
          to="/instructions"
          className={`hover:text-foreground w-max transition-all duration-150 ${
            activeLink === "/instructions" ? "text-foreground border-b-4" : "text-muted-foreground"
          }`}
        >
          Instructions
        </Link>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <CpuIcon className="h-6 w-6" />
              <span className="sr-only">Assessment App</span>
            </Link>
            <Link
              to="/"
              className={`hover:text-foreground w-max transition-all duration-150 ${
                activeLink === "/" ? "text-foreground border-b-4" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/create-test"
              className={`hover:text-foreground w-max transition-all duration-150 ${
                activeLink === "/create-test" ? "text-foreground border-b-4" : "text-muted-foreground"
              }`}
            >
              Create Assessment
            </Link>
            <Link
              to="/instructions"
              className={`hover:text-foreground w-max transition-all duration-150 ${
                activeLink === "/instructions" ? "text-foreground border-b-4" : "text-muted-foreground"
              }`}
            >
              Instructions
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {showSearchBar && (
          <Input
            type="text"
            placeholder="Search assessments..."
            className="pl-4 max-w-72 flex-1"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full flex-0"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;

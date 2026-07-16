import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFoundPage";
import ReportPage from "./pages/ReportPage";
import Navbar from "./components/Navbar"; // Adjust this path to wherever your Navbar file is saved

export default function App() {
  // 1. Define the search states and handlers required by the Navbar
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Add your actual search logic here (e.g., updating map coordinates, calling an API, etc.)
    console.log("Searching for:", searchQuery);
    
    // Simulating search completion
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleLogoClick = () => {
    // Logic when logo is clicked (e.g., reset view, scroll to top)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function ScrollToHashElement() {
    const { hash, pathname } = useLocation();

    useEffect(() => {
      if (hash) {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, [hash, pathname]);

    return null;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#d9d9d9]">
      <div className="relative z-10 bg-transparent">
        <Router>
          <ScrollToHashElement />
          
          <Navbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            onLogoClick={handleLogoClick}
          />
          
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
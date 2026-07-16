import React from "react";
import { useLocation, Link } from 'react-router-dom';
import { Search } from "lucide-react";
import LogoOnlyBlack from "../asset/logo-only-black.svg"; // Adjust the path to your logo image

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    isSearching: boolean;
    onLogoClick: () => void;
}

export default function Navbar({ searchQuery, setSearchQuery, handleSearch, isSearching, onLogoClick }: HeaderProps) {
    const location = useLocation();

    const validPaths = ["/", "/report"];
    const shouldShowNavbar = validPaths.includes(location.pathname);

    if (!shouldShowNavbar) return null;

    return (
        <header className="fixed right-0 top-6 z-50 flex h-16 w-full max-w-4xl items-center justify-between bg-white pl-8 pr-6 shadow-lg rounded-l-[40px] border-y border-l border-gray-100">
            
            {/* Logo Area */}
            <button onClick={onLogoClick} className="flex items-center cursor-pointer transition-opacity hover:opacity-80 focus:outline-none">
                {/* Visual replacement mimicking the picture's logo structure */}
                <img src={LogoOnlyBlack} alt="LaporJalan.id Logo" className="w-8 h-8 object-contain" />                <span className="sr-only">LaporJalan.id</span>
            </button>

            {/* Navigation Links & Search Bar Form */}
            <div className="flex items-center gap-8">
                
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-gray-800 font-medium text-sm">
                    <Link 
                        to="/" 
                        className={`transition-colors hover:text-gray-500 ${location.pathname === '/' ? 'text-black font-semibold' : 'text-gray-600'}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className={`transition-colors hover:text-gray-500 ${location.pathname === '/about' ? 'text-black font-semibold' : 'text-gray-600'}`}
                    >
                        About
                    </Link>
                    <Link 
                        to="/report" 
                        className={`transition-colors hover:text-gray-500 ${location.pathname === '/report' ? 'text-black font-semibold' : 'text-gray-600'}`}
                    >
                        Report
                    </Link>
                </nav>

                {/* Search Bar Form */}
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <div className="absolute left-4 text-gray-700 pointer-events-none z-10">
                        <Search size={18} className={isSearching ? "animate-pulse" : ""} />
                    </div>
                    <input
                        type="text"
                        placeholder="search location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isSearching}
                        className="h-10 w-64 pl-11 pr-4 rounded-full bg-[#FEF9E7] text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-normal disabled:opacity-70"
                    />
                </form>
            </div>

        </header>
    );
}
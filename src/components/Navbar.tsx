import React from "react";
import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    handleSearch?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Navbar({ searchQuery, setSearchQuery, handleSearch }: NavbarProps) {
    const location = useLocation();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4">
            <div className="bg-white rounded-full shadow-lg pr-4 pl-6 py-3 flex items-center justify-between w-full">
                
                {/* Logo Asli (Mengambil dari folder public/assets) */}
                <Link to="/" className="flex items-center">
                    {/* Kamu bisa ganti logo-only-black.svg menjadi logo-full-black.svg jika ingin ada teksnya */}
                    <img src="/assets/logo/logo-only-black.svg" alt="Logo" className="h-8 md:h-9" />
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center mr-6 gap-8 text-sm font-bold text-slate-500">
                    <Link to="/" className={location.pathname === "/" ? "text-slate-900" : "hover:text-slate-900"}>Home</Link>
                    <Link to="/about" className={location.pathname === "/about" ? "text-slate-900" : "hover:text-slate-900"}>Information</Link>
                    <Link to="/report" className={location.pathname === "/report" ? "text-slate-900" : "hover:text-slate-900"}>Report</Link>
                    <Link to="/admin" className={location.pathname === "/admin" ? "text-red-500" : "text-red-400 hover:text-red-500"}>Admin</Link>
                </div>

                {/* Search Bar Kuning */}
                {/* Search bar hanya muncul jika ada fungsi handleSearch dari parent component (seperti di halaman Report) */}
                {handleSearch && setSearchQuery && (
                    <form 
                        onSubmit={handleSearch} 
                        className="flex items-center bg-[#fef0c7] rounded-full px-4 py-2.5 w-64 transition-all focus-within:ring-2 focus-within:ring-yellow-400"
                    >
                        <Search className="text-slate-600 w-4 h-4 mr-2 shrink-0" />
                        <input 
                            type="text" 
                            placeholder="search location..." 
                            value={searchQuery || ""}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 placeholder-slate-500"
                        />
                    </form>
                )}
            </div>
        </nav>
    );
}
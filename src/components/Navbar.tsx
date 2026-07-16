import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    handleSearch?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Navbar({ searchQuery, setSearchQuery, handleSearch }: NavbarProps) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "Information" },
        { to: "/report", label: "Report" },
        { to: "/admin", label: "Admin", isRed: true },
    ];

    return (
        <nav className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-6xl px-3 md:px-4">
            <div className="bg-white rounded-full shadow-lg pr-3 pl-4 md:pr-4 md:pl-6 py-2.5 md:py-3 flex items-center justify-between w-full">
                
                {/* Logo */}
                <Link to="/" className="flex items-center shrink-0">
                    <img src="/assets/logo/logo-only-black.svg" alt="Logo" className="h-7 md:h-9" />
                </Link>

                {/* Nav Links Desktop */}
                <div className="hidden md:flex items-center mr-6 gap-8 text-sm font-bold text-slate-500">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={
                                link.isRed
                                    ? location.pathname === link.to ? "text-red-500" : "text-red-400 hover:text-red-500"
                                    : location.pathname === link.to ? "text-slate-900" : "hover:text-slate-900"
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Search Bar (Desktop) */}
                {handleSearch && setSearchQuery && (
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center bg-[#fef0c7] rounded-full px-4 py-2.5 w-64 transition-all focus-within:ring-2 focus-within:ring-yellow-400"
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

                {/* Mobile: Search icon + Hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* Mobile Search (show only on report page) */}
                    {handleSearch && setSearchQuery && (
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center bg-[#fef0c7] rounded-full px-3 py-2 w-36 focus-within:ring-2 focus-within:ring-yellow-400"
                        >
                            <Search className="text-slate-600 w-3.5 h-3.5 mr-1.5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={searchQuery || ""}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-500"
                            />
                        </form>
                    )}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-bold border-b border-slate-50 last:border-0 transition-colors ${
                                link.isRed
                                    ? location.pathname === link.to
                                        ? "text-red-500 bg-red-50"
                                        : "text-red-400 hover:bg-red-50"
                                    : location.pathname === link.to
                                        ? "text-slate-900 bg-slate-50"
                                        : "text-slate-500 hover:bg-slate-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
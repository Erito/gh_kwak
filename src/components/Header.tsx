import React from "react";
import { Search, AlertCircle } from "lucide-react";

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    isSearching: boolean;
    onLogoClick: () => void;
}

export default function Header({ searchQuery, setSearchQuery, handleSearch, isSearching, onLogoClick }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <button onClick={onLogoClick} className="flex items-center gap-2 group text-left">
                    <AlertCircle className="text-red-500 w-8 h-8 group-hover:scale-110 transition-transform" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-600 to-orange-500">
                        LaporJalan.id
                    </h1>
                </button>

                <form onSubmit={handleSearch} className="flex w-full md:w-96 relative">
                    <input
                        type="text"
                        placeholder="Cari lokasi atau Lat, Lng..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="absolute right-1 top-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors disabled:bg-slate-300"
                    >
                        {isSearching ? "Mencari..." : "Cari"}
                    </button>
                </form>
            </div>
        </header>
    );
}
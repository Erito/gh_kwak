import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-stone-950 font-mono text-stone-300">
            {/* The Navbar will now be present on every route nested inside this layout */}
            <Navbar searchQuery={""} setSearchQuery={function (query: string): void {
                throw new Error("Function not implemented.");
            } } handleSearch={function (e: React.FormEvent<HTMLFormElement>): void {
                throw new Error("Function not implemented.");
            } } isSearching={false} onLogoClick={function (): void {
                throw new Error("Function not implemented.");
            } } />
            
            <main className="w-full">
                {/* React Router injects child route screens right here */}
                <Outlet />
            </main>
        </div>
    );
}
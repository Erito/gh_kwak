import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePages";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Page Utama */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Page About (Lihat data & Filter) */}
                <Route path="/about" element={<HomePage />} />
                
                {/* 3. Page Map (Khusus Lapor) */}
                <Route path="/report" element={<ReportPage />} />
                
                {/* 4. Page Admin (Filter Region) */}
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}
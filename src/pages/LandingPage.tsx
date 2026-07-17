import Navbar from "../components/Navbar";
import Heroes from "../components/Heroes";
import Information from "../components/Information";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#383838]">
            <Navbar />
            <main>
                <Heroes />
                <Information />
            </main>
        </div>
    );
}
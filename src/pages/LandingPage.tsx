import Navbar from "../components/Navbar";
import Heroes from "../components/Heroes";
import Information from "../components/Information";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Heroes />
                <Information />
            </main>
        </div>
    );
}
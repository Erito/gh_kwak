import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import logo from "../../public/assets/logo/logo-only-white.svg";

function MapZoomOutEffect() {
    const map = useMap();
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        map.setZoom(15, { animate: false });
        const timer = setTimeout(() => {
            map.flyTo(map.getCenter(), 12, {
                animate: true,
                duration: 4,
                easeLinearity: 0.1,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [map]);

    return null;
}

const defaultCenter: [number, number] = [-6.2574, 106.6183];

export default function Heroes() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-50 rounded-br-[120px] overflow-hidden shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
        >
            <Navbar />

            {/* ── HERO ── full-bleed map with yellow panel on top */}
            <section className="relative pt-16 sm:pt-20 h-screen md:h-screen rounded-br-[120px] bg-[#45474B] overflow-hidden">

                {/* Map — fills the entire section */}
                <div className="absolute inset-0 z-0 bg-[#45474B] rounded-br[120px] overflow-hidden">
                    <MapContainer
                        center={defaultCenter}
                        zoom={15}
                        scrollWheelZoom={false}
                        zoomControl={false}
                        attributionControl={false}
                        className="w-full h-full"
                    >
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution="Tiles © Esri"
                        />
                        <MapZoomOutEffect />
                    </MapContainer>

                    {/* Vignette over map */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)"
                        }}
                    />
                </div>

                {/* Yellow panel — overlaid on the left, floating above the map */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="absolute top-1/2 -translate-y-1/2 z-10
                               h-full lg:w-[min(40%,85vw)] w-[min(95%,95vw)]
                               bg-[#F5C800] rounded-br-[120px]
                               flex flex-col justify-between
                               px-7 md:px-9
                                mr-20 pb-20
                               shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
                >
                    {/* Logo mark + headline */}
                    <div className="flex flex-row gap-3 mt-40 items-center">
                        <div className="">
                            <img src={logo} alt="Logo" className="w-20 h-20 md:w-32 md:h-32" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-light text-white leading-tight">
                            your <span className="font-black">one stop</span><br />
                            road solutions
                        </h1>
                    </div>

                    {/* Feature list */}
                        <ul className="mt-8 flex flex-col gap-12 pl-10">
                        {[
                            { line1: "Integration with", bold: "Land Developers." },
                            { line1: "Fully ", bold2: "public", mid: " &", line2: "Fully ", bold3: "reliable." },
                            { line1: "Know everything", bold: "around you." },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-2 items-center">
                            {/* Bollard + dashed connecor column */}
                            <div className="flex flex-col items-center w-10 shrink-0">
                                {/* Bollard SVG */}
                                <svg width="40" height="60" viewBox="0 0 44 64" fill="none">
                                <rect x="8" y="4" width="28" height="56" rx="14" fill="#2d2d2d"/>
                                <clipPath id={`clip-${i}`}>
                                    <rect x="8" y="4" width="28" height="56" rx="14"/>
                                </clipPath>
                                <g clipPath={`url(#clip-${i})`}>
                                    <rect x="-4" y="18" width="52" height="10" fill="#F5C800" transform="rotate(-20 22 23)"/>
                                    <rect x="-4" y="34" width="52" height="10" fill="#F5C800" transform="rotate(-20 22 39)"/>
                                </g>
                                </svg>
                                {/* Dashed line — hidden on last item */}
                                {i < 2 && (
                                <div className="flex-1 border-l-2 border-dashed border-[#1a1a1a]/40 my-1" />
                                )}
                            </div>

                            {/* Text */}
                            <p className="text-[#1a1a1a] text-xl leading-snug pb-3 pl-4">
                                {i === 0 && <>Integration with<br/><strong className="font-black">Land Developers.</strong></>}
                                {i === 1 && <>Fully <strong className="font-black">public</strong> &<br/>Fully <strong className="font-black">reliable.</strong></>}
                                {i === 2 && <>Know everything<br/><strong className="font-black">around you.</strong></>}
                            </p>
                            </li>
                        ))}
                        </ul>
                </motion.div>
            </section>
        </motion.div>
    );
}
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import logo from "../../public/assets/logo/logo-only-white.svg";
import bgmap from "../../public/assets/heroes/bgMap.svg";

export default function Heroes() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="md:h-full rounded-br-[80px] md:rounded-br-[120px] overflow-hidden shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
        >
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative h-[85vh] md:h-screen rounded-br-[80px] md:rounded-br-[120px] bg-[#45474B] overflow-hidden">

                {/* Map */}
                <div className="absolute inset-0 z-0 bg-[#45474B] overflow-hidden">
                    <motion.img
                        src={bgmap}
                        alt="Map Background"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 4, ease: [0.1, 0.05, 0.3, 1] }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)"
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="absolute top-1/2 -translate-y-1/2 z-10
                               h-full w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[45vw] xl:w-[40vw]
                               bg-[#F5C800] rounded-br-[80px] md:rounded-br-[120px]
                               flex flex-col justify-between
                               px-6 md:px-10 pb-16 md:pb-20
                               shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
                >
                    {/* Logo mark + headline */}
                    <div className="flex flex-row gap-3 mt-24 md:mt-36 items-center">
                        <div className="shrink-0">
                            <img src={logo} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-light text-white leading-tight">
                                your <span className="font-black">one stop</span> road<br />
                            </h1>
                            <h1 className="relative leading-none text-white tracking-tight mt-1 md:mt-2">
                                <span className="block overflow-hidden h-[1.2em] relative font-black font-main text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                                    <span className="absolute flex flex-col left-0 top-0 animate-[ticker_10s_cubic-bezier(0.76,0,0.24,1)_infinite]">
                                        <span className="block text-white font-main">information</span>
                                        <span className="block text-white font-main">report</span>
                                        <span className="block text-white font-main">solution</span>
                                        <span className="block text-white font-main">information</span>
                                    </span>
                                </span>
                            </h1>
                        </div>
                    </div>

                    {/* Feature list */}
                    <ul className="flex flex-col gap-8 md:gap-12 pl-2 md:pl-10 relative mt-8 md:mt-0">
                        <div
                            className="absolute left-7 md:left-15 top-8 bottom-8 w-0.5"
                            style={{
                                backgroundImage: "repeating-linear-gradient(to bottom, #1a1a1a55 0px, #1a1a1a55 6px, transparent 6px, transparent 12px)",
                            }}
                        />

                        {[
                            { line1: "Integration with", bold: "Land Developers." },
                            { line1: "Fully ", bold2: "public", mid: " &", line2: "Fully ", bold3: "reliable." },
                            { line1: "Know everything", bold: "around you." },
                        ].map((_, i) => (
                            <li key={i} className="flex gap-4 items-start relative">
                                <div className="flex flex-col items-center w-10 shrink-0 z-10">
                                    <svg width="40" height="60" viewBox="0 0 44 64" fill="none" className="w-8 h-12 md:w-10 md:h-15">
                                        <rect x="8" y="4" width="28" height="56" rx="14" fill="#2d2d2d" />
                                        <clipPath id={`clip-${i}`}>
                                            <rect x="8" y="4" width="28" height="56" rx="14" />
                                        </clipPath>
                                        <g clipPath={`url(#clip-${i})`}>
                                            <rect x="-4" y="18" width="52" height="10" fill="#F5C800" transform="rotate(-20 22 23)" />
                                            <rect x="-4" y="34" width="52" height="10" fill="#F5C800" transform="rotate(-20 22 39)" />
                                        </g>
                                    </svg>
                                </div>

                                <p className="text-[#1a1a1a] text-base sm:text-lg md:text-xl leading-snug pb-3 pt-1">
                                    {i === 0 && <>Integration with<br /><strong className="font-black">Land Developers.</strong></>}
                                    {i === 1 && <>Fully <strong className="font-black">public</strong> &<br />Fully <strong className="font-black">reliable.</strong></>}
                                    {i === 2 && <>Know everything<br /><strong className="font-black">around you.</strong></>}
                                </p>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </section>
        </motion.div>
    );
}
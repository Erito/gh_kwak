import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import logo from "../../public/assets/logo/logo-only-white.svg";

export default function Heroes() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="md:h-full rounded-br-[120px] overflow-hidden shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
        >
            <Navbar />

            {/* ── HERO ── full-bleed map with yellow panel on top */}
            <section className="relative h-[80vh] md:h-screen rounded-br-[120px] bg-[#45474B] overflow-hidden">

                {/* Map — fills the entire section */}
                <div className="absolute inset-0 z-0 bg-[#45474B] overflow-hidden">
                    <motion.img
                        src="../../public/assets/heroes/bgMap.svg"
                        alt=""
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 4, ease: [0.1, 0.05, 0.3, 1] }}
                    />

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
                               h-full lg:w-[min(40%,85vw)] w-[min(75%,75vw)]
                               bg-[#F5C800] rounded-br-[120px]
                               flex flex-col justify-between
                               px-7 md:px-9
                                r-20 pb-20
                               shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]"
                >
                    {/* Logo mark + headline */}
                    <div className="flex flex-row gap-3 mt-28 md:mt-40 items-center">
                        <div className="">
                            <img src={logo} alt="Logo" className="w-20 h-20 md:w-32 md:h-32" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-4xl font-light text-white leading-tight">
                                your <span className="font-black">one stop</span> road<br />
                            </h1>
                            <h1 className="relative leading-none text-white tracking-tight">
                                <span className="block overflow-hidden h-[1.2em] relative font-black font-main text-2xl md:text-3xl lg:text-4xl">

                                    <span className="absolute flex flex-col left-0 top-0 animate-[ticker_10s_cubic-bezier(0.76,0,0.24,1)_infinite]">
                                        <span className="block text-white font-main">information</span>
                                        <span className="block text-white font-main">report</span>
                                        <span className="block text-white font-main">solution</span>
                                        {/* Loop back to the first word so the infinite scroll animation is seamless */}
                                        <span className="block text-white font-main">information</span>
                                    </span>
                                </span>
                                <span className="flex items-center">
                                    <span className="font-main inline-block font-bold text-[#FFF24A] relative text-2xl md:text-3xl lg:text-4xl">

                                    </span>
                                </span>
                            </h1>
                        </div>

                    </div>

                    {/* Feature list */}
                    <ul className="flex flex-col gap-12 pl-10 relative">
                        {/* Absolute dashed line running through all bollards */}
                        <div
                            className="absolute left-15 top-8 bottom-8 w-[2px]"
                            style={{
                                backgroundImage: "repeating-linear-gradient(to bottom, #1a1a1a55 0px, #1a1a1a55 6px, transparent 6px, transparent 12px)",
                            }}
                        />

                        {[
                            { line1: "Integration with", bold: "Land Developers." },
                            { line1: "Fully ", bold2: "public", mid: " &", line2: "Fully ", bold3: "reliable." },
                            { line1: "Know everything", bold: "around you." },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-2 items-start relative">
                                <div className="flex flex-col items-center w-10 shrink-0 z-10">
                                    <svg width="40" height="60" viewBox="0 0 44 64" fill="none">
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

                                <p className="text-[#1a1a1a] text-xl leading-snug pb-3 pl-4">
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
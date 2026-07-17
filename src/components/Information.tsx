import { motion } from "framer-motion";
import { MapPin, PenLine, CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS = [
    { label: "Potholes", src: "./assets/pothole.jpg" },
    { label: "Floods", src: "./assets/flood.jpg" },
    { label: "Maintenance", src: "./assets/maintenance.jpg" },
];

function RoadDivider({ color = "#9ca3af" }: { color?: string }) {
    return (
        <div
            className="w-full h-0.75"
            style={{
                backgroundImage: `repeating-linear-gradient(to right, ${color} 0px, ${color} 40px, transparent 40px, transparent 70px)`,
            }}
        />
    );
}

export default function Information() {
    return (
        <>
            {/* ── ROAD DIVIDER — Found a Roadblock? ── */}
            <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
                <RoadDivider color="#9ca3af" />
                <div className="relative mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-4 py-12 md:py-16 px-6 md:px-20 w-full text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-4xl font-light text-white leading-tight">
                        Found a <br className="hidden md:block" />
                        <span className="font-black md:ml-2 text-[#F5C800]">Roadblock</span>?
                    </h2>
                    <div className="flex items-center">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Report it!</span>
                    </div>
                </div>
                <RoadDivider color="#9ca3af" />
            </section>

            {/* ── 3 STEPS ── */}
            <section className="bg-[#379777] py-12 md:py-8 px-6 md:rounded-tl-[120px] md:rounded-br-[120px] rounded-tl-[60px] rounded-br-[60px] shadow-[0_0_15px_10px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-white/80 mb-8 md:mb-6 text-xl md:text-2xl font-bold">... in 3 simple steps</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative pt-4 md:pt-8">
                        <svg
                            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none items-stretch overflow-visible"
                            preserveAspectRatio="none"
                            viewBox="10 0 80 50"
                        >
                            <path
                                d="M 17 50 C 28 28, 38 72, 50 50 S 72 28, 83 50"
                                fill="none"
                                stroke="#383838"
                                strokeWidth="0.8"
                                strokeDasharray="3 2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        
                        {[
                            { icon: <MapPin className="w-10 h-10 md:w-12 md:h-12" />, label: "ENTER\nLOCATION", rotate: -4 },
                            { icon: <PenLine className="w-10 h-10 md:w-12 md:h-12" />, label: "\nINPUT DETAILS", rotate: 7 },
                            { icon: <CircleCheckBig className="w-10 h-10 md:w-12 md:h-12" />, label: "\nSUBMIT!", rotate: -2 },
                        ].map(({ icon, label, rotate }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.12 }}
                                className="flex justify-center"
                            >
                                <div
                                    style={{ transform: `rotate(${rotate}deg)` }}
                                    className="bg-white rounded-tl-[20px] rounded-br-[20px] p-5 md:p-6 flex flex-col items-end shadow-sm border-6 border-[#F5C800]/30 relative z-10 w-[80%] md:w-full drop-shadow-none hover:drop-shadow-[0_0_16px_rgba(245,200,0,0.5)] transition-all duration-300"
                                >
                                    <span className="text-slate-900">{icon}</span>
                                    <span className="text-sm md:text-sm font-black text-slate-800 whitespace-pre-line leading-snug w-full text-start mt-2 md:mt-0">{label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-center text-white/80 mt-10 md:mt-16 mb-2 md:mb-6 text-xl md:text-2xl font-bold">It cannot get any easier!</p>
                </div>
            </section>

            {/* ── REPORT when you see… ── */}
            <section className="bg-[#383838] px-4 md:px-6 py-16 md:py-20">
                <RoadDivider color="#F4CE14" />

                <div className="max-w-5xl pt-10 md:pt-12 mx-auto">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-8 md:mb-14">
                        <span className="font-black text-[#F5C800]">Report</span> when you see...
                    </h2>

                    {/* Cards grid: Diubah jadi 3 kolom baku (grid-cols-3) di semua device */}
                    <div className="grid grid-cols-3 gap-2 md:gap-5 px-0">
                        {ITEMS.map(({ label, src }) => (
                            <div
                                key={label}
                                /* Aspect rationya diubah jadi agak memanjang ke bawah (3/4) di HP agar tidak terlalu gepeng */
                                className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-3/4 sm:aspect-auto sm:h-72 md:h-80 drop-shadow-none hover:drop-shadow-[0_0_16px_rgba(245,200,0,0.5)] transition-all duration-300"
                            >
                                <img
                                    src={src}
                                    alt={label}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)"
                                    }}
                                />
                                {/* Teks dikecilkan dan jarak pinggir disesuaikan untuk layar HP */}
                                <span className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-white text-[11px] sm:text-base md:text-lg font-black drop-shadow-lg leading-tight whitespace-pre-line">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <RoadDivider color="#F4CE14" />
            
            <section className="bg-[#383838] pt-8 py-12 w-full text-center">
                <Link
                    to="/report"
                    className="inline-block px-8 py-4 bg-[#F5C800] text-slate-900 text-lg md:text-base font-bold shadow-md hover:bg-[#e0b800] transition-all rounded-full duration-300 drop-shadow-none hover:drop-shadow-[0_0_16px_rgba(245,200,0,0.5)]"
                >
                    Start Reporting!
                </Link>
            </section>
            
            <div className="border-[#F4CE14] border-t-12"></div>
        </>
    );
}
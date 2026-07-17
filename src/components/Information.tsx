import { motion, type Variants } from "framer-motion";
import { MapPin, MousePointerClick, Edit3, PenLine, CircleCheckBig } from "lucide-react";

const steps = [
    {
        icon: MousePointerClick,
        title: "Mulai Laporan",
        description: "Klik tombol 'Report' di navigasi untuk memulai proses pelaporan kerusakan jalan.",
        bgColor: "bg-white",
        titleColor: "text-slate-900",
        descColor: "text-slate-600",
        iconWrapper: "bg-emerald-100",
        iconColor: "text-emerald-600",
        stepColor: "text-emerald-500",
        step: "01",
    },
    {
        icon: MapPin,
        title: "Tandai Lokasi",
        description: "Pilih lokasi jalan rusak secara akurat di peta interaktif kami, baik dengan klik atau pencarian.",
        // Background dibuat agak hijau agar beda dari Step 1
        bgColor: "bg-emerald-50", 
        titleColor: "text-slate-900",
        descColor: "text-slate-600",
        // Icon wrapper diubah jadi putih agar kontras dengan background emerald-50
        iconWrapper: "bg-white", 
        iconColor: "text-emerald-600",
        stepColor: "text-emerald-600",
        step: "02",
    },
    {
        icon: Edit3,
        title: "Isi Detail Laporan",
        description: "Lengkapi laporan dengan deskripsi singkat dan unggah foto kerusakan untuk dianalisis oleh AI.",
        bgColor: "bg-emerald-600", 
        titleColor: "text-white",
        descColor: "text-emerald-50",
        iconWrapper: "bg-white",
        iconColor: "text-emerald-600",
        stepColor: "text-emerald-200",
        step: "03",
    },
];

const finalStep = {
    icon: CircleCheckBig,
    title: "Kirim & Pantau",
    description: "Laporan Anda akan langsung diterima oleh dinas terkait. Pantau progres perbaikan secara transparan.",
    bgColor: "bg-amber-400", 
    titleColor: "text-slate-900",
    descColor: "text-slate-800",
    iconWrapper: "bg-slate-900",
    iconColor: "text-amber-400",
    stepColor: "text-slate-900",
    step: "04",
};

const allSteps = [...steps, finalStep];

const ITEMS = [
    { label: "Potholes",    src: "./assets/pothole.jpg" },
    { label: "Floods",      src: "./assets/flood.jpg" },
    { label: "Maintenance", src: "./assets/maintenance.jpg" },
];

function RoadDivider({ color = "#9ca3af" }: { color?: string }) {
    return (
        <div
        className="w-full h-[3px]"
        style={{
            backgroundImage: `repeating-linear-gradient(to right, ${color} 0px, ${color} 40px, transparent 40px, transparent 70px)`,
        }}
        />
    );
}

export default function Information() {
    const cardVariants: Variants = {
        offscreen: {
            x: 150, 
            opacity: 0,
        },
        onscreen: {
            x: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 0.9,
            },
        },
    };

    return (
        <>
        {/* ── ROAD DIVIDER — Found a Roadblock? ── */}
        <section className="py-12 px-6 relative overflow-hidden">
            <RoadDivider color="#9ca3af" />
            <div className="relative mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-16 px-8 md:px-20 w-full">
                <h2 className="text-3xl md:text-4xl font-light text-white">
                    Found a<br/>
                    <span className="font-black text-[#F5C800]">Roadblock</span>?
                </h2>
                <div className="flex items-center gap-4">
                    {/* Warning icon */}
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="opacity-70">
                        <circle cx="18" cy="18" r="17" stroke="#F5C800" strokeWidth="2" />
                        <path d="M18 10v10M18 24v2" stroke="#F5C800" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-3xl md:text-4xl font-black text-white">Report it!</span>
                </div>
            </div>
            <RoadDivider color="#9ca3af" />
        </section>

        {/* ── 3 STEPS ── */}
        <section className="bg-[#379777] py-8 px-6 rounded-tl-[120px] rounded-br-[120px] shadow-[0_0_15px_10px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <p className="text-center text-white/80 mb-6 text-2xl font-bold">... in 3 simple steps</p>

                <div className="grid grid-cols-3 gap-6 md:gap-12 relative pt-8">
                    {/* Dashed connector lines */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none items-stretch overflow-visible"
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
                        { icon: <MapPin size={48}/>, label: "ENTER\nLOCATION", rotate:-4 },
                        { icon: <PenLine size={48} />, label: "\nINPUT DETAILS", rotate:7 },
                        { icon: <CircleCheckBig size={48} />, label: "\nSUBMIT!", rotate:-2 },
                    ].map(({ icon, label, rotate }, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.12 }}
                        >
                            <div
                                style={{ transform: `rotate(${rotate}deg)` }}
                                className="bg-white rounded-tl-[20px] rounded-br-[20px] p-4 md:p-6 flex flex-col items-end shadow-sm border border-[#F5C800]/30 relative z-10"
                            >
                                <span className="text-2xl">{icon}</span>
                                <span className="text-xs w-full text-start md:text-sm font-black text-slate-800 whitespace-pre-line leading-snug">{label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="text-center text-white/80 mb-6 text-2xl font-bold pt-16">It cannot get any easier!</p>
            </div>
        </section>

        {/* ── REPORT when you see… ── */}
        <section className="bg-[#383838] px-6 py-14 md:py-20">
            <RoadDivider color="#F4CE14" />

            <div className="max-w-5xl pt-10 mx-auto">
 
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-10 md:mb-14">
                    <span className="font-black text-[#F5C800]">Report</span> when you see...
                </h2>
 
                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                    {ITEMS.map(({ label, src }) => (
                        <div
                            key={label}
                            className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-auto sm:h-72 md:h-80"
                        >
                            <img
                                src={src}
                                alt={label}
                                className="w-full h-full object-cover"
                            />
 
                            {/* Bottom gradient + label */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)"
                                }}
                            />
                            <span className="absolute bottom-4 left-4 text-white text-base md:text-lg font-medium">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
                    
        </section>
        <RoadDivider color="#F4CE14" />
        <section className="bg-[#383838] pt-8 py-20 md:pt-8">
            <div className="max-w-5xl pt-10 mx-auto text-center">
                <a href="/report" className="mx-auto mt-12 md:mt-16 px-6 py-3 md:px-8 md:py-4 bg-[#F5C800] text-slate-900 font-semibold shadow-md hover:bg-[#e0b800] transition-colors rounded-full duration-300">Start Reporting!</a>
            </div>
        </section>
        <div className="border-[#F4CE14] border-t-[12px]"></div>
        </>
    );
}
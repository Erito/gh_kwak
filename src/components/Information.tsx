import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Edit3, CheckCircle2, MousePointerClick } from "lucide-react";

const steps = [
    {
        icon: MousePointerClick,
        title: "Mulai Laporan",
        description: "Klik tombol 'Report' di navigasi untuk memulai proses pelaporan kerusakan jalan.",
        bgColor: "bg-slate-200",
        titleColor: "text-emerald-800",
        iconColor: "text-emerald-600",
        step: "01",
    },
    {
        icon: MapPin,
        title: "Tandai Lokasi",
        description: "Pilih lokasi jalan rusak secara akurat di peta interaktif kami, baik dengan klik atau pencarian.",
        bgColor: "bg-emerald-200",
        titleColor: "text-emerald-800",
        iconColor: "text-emerald-600",
        step: "02",
    },
    {
        icon: Edit3,
        title: "Isi Detail Laporan",
        description: "Lengkapi laporan dengan deskripsi singkat dan unggah foto kerusakan untuk dianalisis oleh AI.",
        bgColor: "bg-emerald-300",
        titleColor: "text-emerald-900",
        iconColor: "text-emerald-700",
        step: "03",
    },
];

const finalStep = {
    icon: CheckCircle2,
    title: "Kirim & Pantau",
    description: "Laporan Anda akan langsung diterima oleh dinas terkait. Pantau progres perbaikan secara transparan.",
    bgColor: "bg-yellow-400",
    iconColor: "text-white",
    step: "04",
};

export default function Information() {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const { scrollXProgress } = useScroll({
        container: scrollContainerRef,
    });

    const scaleX = useTransform(scrollXProgress, [0, 1], [0, 1]);

    return (
        <section className="relative bg-slate-50 text-slate-800">
            {/* ===== MOBILE LAYOUT (block, vertical) ===== */}
            <div className="md:hidden px-4 py-16 pt-12">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                    Lapor Kerusakan, Semudah <span className="text-emerald-500">1-2-3</span>
                </h2>
                <p className="text-center text-gray-500 text-sm mb-10">Proses pelaporan yang dirancang untuk kecepatan dan kemudahan.</p>

                <div className="flex flex-col gap-4">
                    {steps.map((step, index) => (
                        <div key={index} className={`${step.bgColor} rounded-2xl p-5 flex items-start gap-4 shadow-sm`}>
                            <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center shrink-0 shadow">
                                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 tracking-widest">STEP {step.step}</span>
                                <h3 className={`text-lg font-bold ${step.titleColor} mb-1`}>{step.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}

                    {/* Final Step Mobile */}
                    <div className={`${finalStep.bgColor} rounded-2xl p-5 flex items-start gap-4 shadow-sm`}>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow">
                            <finalStep.icon className={`w-6 h-6 ${finalStep.iconColor}`} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-yellow-700 tracking-widest">STEP {finalStep.step}</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{finalStep.title}</h3>
                            <p className="text-emerald-900 text-sm leading-relaxed">{finalStep.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== DESKTOP LAYOUT (horizontal scroll, original) ===== */}
            <div className="relative hidden md:flex h-screen items-center overflow-hidden">
                {/* Judul Statis */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20 pointer-events-none">
                    <h2 className="text-4xl md:text-5xl mt-5 font-bold text-center text-slate-900">
                        Lapor Kerusakan, Semudah <span className="text-emerald-500">1-2-3</span>
                    </h2>
                    <p className="text-center text-gray-700 mt-2">Proses pelaporan yang dirancang untuk kecepatan dan kemudahan.</p>
                </div>

                {/* Container Horizontal Scroll */}
                <div
                    ref={scrollContainerRef}
                    className="flex absolute inset-0 w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide z-10"
                >
                    {steps.map((step, index) => (
                        <div key={index} className="w-screen h-screen flex items-center justify-center p-8 flex-shrink-0 snap-center">
                            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-2xl">
                                <div className={`w-20 h-20 ${step.bgColor} rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg`}>
                                    <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                                </div>
                                <h3 className={`text-3xl font-bold ${step.titleColor} mb-2`}>{step.title}</h3>
                                <p className="text-slate-500">{step.description}</p>
                            </div>
                        </div>
                    ))}

                    <div className={`w-screen h-screen flex-shrink-0 snap-center flex flex-col items-center justify-center text-center p-8 ${finalStep.bgColor}`}>
                        <div className="w-24 h-24 mt-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-lg">
                            <finalStep.icon className={`w-12 h-12 ${finalStep.iconColor}`} />
                        </div>
                        <h3 className="text-5xl md:text-7xl font-bold leading-tight text-black">
                            {finalStep.title}
                        </h3>
                        <p className="text-emerald-900 mt-4 text-lg max-w-xl">{finalStep.description}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-slate-200 rounded-full overflow-hidden z-20">
                    <motion.div className="h-full bg-emerald-500" style={{ scaleX, originX: 0 }} />
                </div>
            </div>
        </section>
    );
}
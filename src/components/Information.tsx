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
    },
    {
        icon: MapPin,
        title: "Tandai Lokasi",
        description: "Pilih lokasi jalan rusak secara akurat di peta interaktif kami, baik dengan klik atau pencarian.",
        bgColor: "bg-emerald-200",
        titleColor: "text-emerald-800",
        iconColor: "text-emerald-600",
    },
    {
        icon: Edit3,
        title: "Isi Detail Laporan",
        description: "Lengkapi laporan dengan deskripsi singkat dan unggah foto kerusakan untuk dianalisis oleh AI.",
        bgColor: "bg-emerald-300",
        titleColor: "text-emerald-900",
        iconColor: "text-emerald-700",
    },
];

const finalStep = {
    icon: CheckCircle2,
    title: "Kirim & Pantau",
    description: "Laporan Anda akan langsung diterima oleh dinas terkait. Pantau progres perbaikan secara transparan.",
    bgColor: "bg-yellow-400",
    iconColor: "text-white",
};

export default function Information() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    // Membuat efek scroll horizontal untuk kartu
    const x = useTransform(scrollYProgress, [0, 0.8], ["0%", "-66.66%"]);
    // Menganimasikan progress bar
    const scaleX = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
    // Memunculkan pesan terakhir dengan fade-in
    const finalTextOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-slate-50 text-slate-800">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20">
                    <h2 className="text-4xl md:text-5xl mt-5 font-bold text-center text-slate-900">
                        Lapor Kerusakan, Semudah <span className="text-emerald-500">1-2-3</span>
                    </h2>
                    <p className="text-center text-gray-700 mt-2">Proses pelaporan yang dirancang untuk kecepatan dan kemudahan.</p>
                </div>

                {/* Kartu yang bisa scroll horizontal */}
                <motion.div style={{ x }} className="flex absolute left-0 top-0 h-full">
                    {steps.map((step, index) => (
                        <div key={index} className="w-screen h-screen flex items-center justify-center p-8">
                            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-2xl">
                                <div className={`w-20 h-20 ${step.bgColor} rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg`}>
                                    <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                                </div>
                                <h3 className={`text-3xl font-bold ${step.titleColor} mb-2`}>{step.title}</h3>
                                <p className="text-slate-500">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Pesan Terakhir */}
                <motion.div 
                    style={{ opacity: finalTextOpacity }}
                    className={`absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-8 ${finalStep.bgColor}`}
                >
                    <div className="w-24 h-24 mt-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-8">
                        <finalStep.icon className={`w-12 h-12 ${finalStep.iconColor}`} />
                    </div>
                    <h3 className="text-5xl md:text-7xl font-bold leading-tight text-black">
                        {finalStep.title}
                    </h3>
                    <p className="text-emerald-900 mt-4 text-lg max-w-xl">{finalStep.description}</p>
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" style={{ scaleX, originX: 0 }} />
                </div>
            </div>
        </section>
    );
}
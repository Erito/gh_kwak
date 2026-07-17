import { motion, type Variants } from "framer-motion";
import { MapPin, Edit3, CheckCircle2, MousePointerClick } from "lucide-react";

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
    icon: CheckCircle2,
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
        <section className="relative bg-slate-100 text-slate-800 py-20 md:py-28 overflow-hidden">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-3">
                    Lapor Kerusakan <span className="text-emerald-600">Semudah itu</span>
                </h2>
                <p className="text-center text-gray-600 text-base md:text-lg mb-16 md:mb-24">
                    Proses pelaporan yang dirancang untuk kecepatan dan kemudahan.
                </p>

                <div className="flex flex-col gap-8 md:gap-12">
                    {allSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={`${step.bgColor} rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 shadow-xl border border-black/5`}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.4 }}
                            variants={cardVariants}
                        >
                            <div className={`w-16 h-16 ${step.iconWrapper} rounded-full flex items-center justify-center shrink-0 shadow-md`}>
                                <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-black ${step.stepColor} tracking-widest`}>
                                    STEP {step.step}
                                </span>
                                <h3 className={`text-2xl md:text-3xl font-bold ${step.titleColor} mt-1 mb-2`}>
                                    {step.title}
                                </h3>
                                <p className={`${step.descColor} text-base leading-relaxed`}>
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
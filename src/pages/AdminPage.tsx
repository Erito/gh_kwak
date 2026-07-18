import { useState, useEffect } from "react";
import AdminDashboard from "../components/AdminDashboard";
import { ShieldCheck, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import type { Report } from "../types";

const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";
const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_SELESAI = "https://titusericson.app.n8n.cloud/webhook/jalan-rusak/perbaikan";

export default function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    const [adminRegion, setAdminRegion] = useState<string | null>(null);

    const fetchReports = async () => {
        setInitialLoading(true);
        try {
            const res = await fetch(N8N_WEBHOOK_GET);
            const data: Report[] = await res.json();
            setReports(data || []);
        } catch (err) {
            console.error("Gagal ambil data", err);
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Fungsi Mengubah Status menjadi RESOLVED langsung dari PENDING
    const handleAdminResolve = async (id: string | number, instansi: string, file: File) => {
        setLoading(true);
        const toastId = toast.loading("Mengunggah foto dan memvalidasi perbaikan via AI...");
        try {
            // Upload foto ke ImgBB
            const formData = new FormData();
            formData.append("image", file);
            const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
            const imgData = await imgRes.json();
            const foto_url = imgData.data.url;

            // Kirim data ke Webhook n8n
            const res = await fetch(N8N_WEBHOOK_POST_SELESAI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    instansi_terkait: instansi,
                    foto_url
                }),
            });

            if (res.ok) {
                toast.success("Sukses! Perbaikan divalidasi dan disimpan.", { id: toastId });
                fetchReports();
            } else {
                toast.error("Ditolak AI! Gambar tidak valid atau jalan belum diperbaiki.", { id: toastId });
            }
        } catch (err) {
            toast.error("Terjadi kesalahan saat memproses perbaikan ke Server.", { id: toastId });
        }
        setLoading(false);
    };

    const uniqueCities = Array.from(new Set(reports.map(r => r.Kota_Kabupaten).filter(Boolean)));

    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                containerClassName="max-sm:!bottom-4 max-sm:!right-4 max-sm:!top-auto max-sm:!left-auto"
                toastOptions={{
                    className: 'text-sm md:text-base max-sm:mb-2 mb-4 mr-4 shadow-lg',
                    duration: 4000,
                }}
            />
            <AnimatePresence mode="wait">
                {!adminRegion ? (
                    <motion.div
                        key="region-select"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                            <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Portal Admin Daerah</h1>
                            <p className="text-slate-500 text-sm mb-8">Silakan pilih wilayah operasional Anda untuk masuk ke dashboard.</p>

                            <div className="space-y-3">
                                {initialLoading ? (
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="w-full h-15 bg-slate-200 rounded-xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    uniqueCities.map((city, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setAdminRegion(String(city))}
                                            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50 transition-colors group"
                                        >
                                            <span className="font-bold text-slate-700 group-hover:text-red-600">{city}</span>
                                            <Map className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                                        </button>
                                    ))
                                )}
                            </div>

                            <button onClick={() => window.location.href = '/'} className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600">
                                &larr; Kembali ke Halaman Utama
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }}
                        exit={{ opacity: 0, y: 20 }}
                        className="min-h-screen bg-slate-200"
                    >
                        <AdminDashboard
                            reports={reports.filter(r => r.Kota_Kabupaten === adminRegion)}
                            onClose={() => setAdminRegion(null)}
                            onResolve={handleAdminResolve}
                            loading={loading}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
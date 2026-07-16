import { useState, useEffect } from "react";
import AdminDashboard from "../components/AdminDashboard";
import { ShieldCheck, Map } from "lucide-react";
import type { Report } from "../types";

const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_ON_PROGRESS = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/on-progress";

export default function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    
    // State baru untuk menyimpan wilayah admin yang login
    const [adminRegion, setAdminRegion] = useState<string | null>(null);

    const fetchReports = async () => {
        try {
            const res = await fetch(N8N_WEBHOOK_GET);
            const data: Report[] = await res.json();
            setReports(data || []);
        } catch (err) {
            console.error("Gagal ambil data", err);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleAdminUpdateProgress = async (id: string | number) => {
        setLoading(true);
        try {
            const res = await fetch(N8N_WEBHOOK_POST_ON_PROGRESS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                alert("Status berhasil diupdate!");
                fetchReports();
            }
        } catch (err) {
            alert("Terjadi kesalahan sistem.");
        }
        setLoading(false);
    };

    // Ambil daftar kota unik untuk pilihan login admin
    const uniqueCities = Array.from(new Set(reports.map(r => r.Kota_Kabupaten).filter(Boolean)));

    // Jika Admin belum memilih wilayahnya, tampilkan Layar "Pilih Wilayah"
    if (!adminRegion) {
        return (
            <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Portal Admin Daerah</h1>
                    <p className="text-slate-500 text-sm mb-8">Silakan pilih wilayah operasional Anda untuk masuk ke dashboard.</p>
                    
                    <div className="space-y-3">
                        {uniqueCities.length === 0 ? (
                            <p className="text-sm text-slate-400">Sedang memuat data wilayah...</p>
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
            </div>
        );
    }

    // Jika sudah memilih wilayah, filter laporan KHUSUS untuk wilayah tersebut
    const regionalReports = reports.filter(r => r.Kota_Kabupaten === adminRegion);

    return (
        <div className="min-h-screen bg-slate-200">
            <AdminDashboard 
                reports={regionalReports} // Data yang masuk ke tabel sudah otomatis terfilter!
                onClose={() => setAdminRegion(null)} // Tombol close digunakan untuk Log Out wilayah
                onUpdateProgress={handleAdminUpdateProgress} 
                loading={loading} 
            />
        </div>
    );
}
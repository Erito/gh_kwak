import { useState } from "react";
import { motion } from "framer-motion";
import { X, MapPin, AlertTriangle, Map, UploadCloud, CheckCircle, Clock } from "lucide-react";
import type { Report } from "../types";

interface AdminDashboardProps {
    reports: Report[];
    onClose: () => void;
    onResolve: (id: string | number, instansi: string, file: File) => void;
    loading: boolean;
}

const StatusBadge = ({ status }: { status: string | undefined }) => {
    const safeStatus = (status || "PENDING").toUpperCase();
    const isResolved = safeStatus === "RESOLVED";
    
    return (
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full border ${
            isResolved 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
            {isResolved ? (
                <>
                    <CheckCircle className="w-4 h-4" />
                    Selesai
                </>
            ) : (
                <>
                    <Clock className="w-4 h-4" />
                    Pending
                </>
            )}
        </span>
    );
};

export default function AdminDashboard({ reports, onClose, onResolve, loading }: AdminDashboardProps) {
    const safeReports = Array.isArray(reports) ? reports : [];
    const sortedReports = [...safeReports].sort((a, b) => {
        const timeA = a.Dibuat_Pada ? new Date(a.Dibuat_Pada).getTime() : 0;
        const timeB = b.Dibuat_Pada ? new Date(b.Dibuat_Pada).getTime() : 0;
        return timeB - timeA;
    });

    const [resolvingId, setResolvingId] = useState<string | number | null>(null);
    const [instansi, setInstansi] = useState("");
    const [resolveFile, setResolveFile] = useState<File | null>(null);

    const handleResolveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (resolvingId && instansi && resolveFile) {
            onResolve(resolvingId, instansi, resolveFile);
            setResolvingId(null);
            setInstansi("");
            setResolveFile(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Utama dengan aksen strip kuning tipis di atasnya */}
                <div className="h-1.5 w-full bg-amber-400 shrink-0" />
<header className="px-6 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 bg-white relative">
    {/* Kiri: Info Utama */}
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
            <Map className="w-6 h-6 text-amber-600" />
        </div>
        <div>
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
                    Admin Dashboard
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Sistem Pantau
                </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Kelola dan verifikasi laporan infrastruktur jalan dari warga.
            </p>
        </div>
    </div>

    {/* Kanan: Ringkasan Status & Tombol Aksi */}
    <div className="flex items-center justify-between sm:justify-end gap-6">
        {/* Ringkasan Statistik */}
        <div className="flex items-center gap-4 border-l border-slate-200 pl-4 hidden sm:flex">
            <div className="text-left">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Laporan</p>
                <p className="text-lg font-bold text-slate-800 font-mono leading-tight">
                    {sortedReports.length}
                </p>
            </div>
            <div className="text-left">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Selesai</p>
                <p className="text-lg font-bold text-emerald-600 font-mono leading-tight">
                    {sortedReports.filter(r => String(r.Status).toUpperCase() === "RESOLVED").length}
                </p>
            </div>
        </div>

        {/* Tombol Close */}
        <button 
            onClick={onClose} 
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            aria-label="Close dashboard"
        >
            <X className="w-5 h-5"/>
        </button>
    </div>
</header>

                {/* Konten Utama */}
                <div className="grow overflow-y-auto bg-slate-50/50">
                    {sortedReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-100">
                                <AlertTriangle className="w-9 h-9 text-amber-500"/>
                            </div>
                            <p className="text-lg font-semibold text-slate-700">Belum Ada Data Laporan</p>
                            <p className="text-sm text-slate-400 mt-1 max-w-sm text-center">Semua laporan dari warga yang masuk akan ditampilkan di sini.</p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            {/* Tampilan Desktop Table View */}
                            <table className="hidden md:table w-full text-base text-left text-slate-600 border-collapse">
                                <thead className="text-sm text-slate-500 font-semibold uppercase bg-white border-b border-slate-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">ID Laporan</th>
                                        <th className="px-6 py-4">Detail Kerusakan</th>
                                        <th className="px-6 py-4">Lokasi Wilayah</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {sortedReports.map((report, idx) => (
                                        <tr key={report.ID_Laporan || idx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-500">
                                                #{String(report.ID_Laporan || "-").slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p className="font-medium text-slate-900 leading-relaxed line-clamp-2">{report.Deskripsi}</p>
                                                {report.Instansi_Pelaksanaan && (
                                                    <span className="inline-block text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded mt-2 border border-slate-200">
                                                        Pelaksana: {report.Instansi_Pelaksanaan}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    {report.Kota_Kabupaten && (
                                                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                                                            <Map className="w-4 h-4 text-amber-500 shrink-0"/>
                                                            <span className="text-sm">{report.Kota_Kabupaten}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <MapPin className="w-4 h-4 shrink-0"/>
                                                        <span className="text-xs">{Number(report.Latitude || 0).toFixed(5)}, {Number(report.Longitude || 0).toFixed(5)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <StatusBadge status={report.Status}/>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {String(report.Status).toUpperCase() !== "RESOLVED" ? (
                                                    <button
                                                        onClick={() => report.ID_Laporan && setResolvingId(report.ID_Laporan)}
                                                        disabled={loading}
                                                        className="font-bold text-sm bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm shadow-amber-400/10"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex text-sm text-emerald-600 font-semibold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                                        Tuntas ✓
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Tampilan Mobile List View */}
                            <div className="md:hidden divide-y divide-slate-100 bg-white">
                                {sortedReports.map((report, idx) => (
                                    <div key={report.ID_Laporan || idx} className="p-5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono text-sm font-semibold text-slate-400">
                                                #{String(report.ID_Laporan || "-").slice(0, 8)}
                                            </span>
                                            <StatusBadge status={report.Status}/>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-base font-medium text-slate-900 leading-normal">{report.Deskripsi}</p>
                                            {report.Instansi_Pelaksanaan && (
                                                <p className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded inline-block border border-slate-200 mt-1.5">
                                                    Pelaksana: {report.Instansi_Pelaksanaan}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500">
                                            {report.Kota_Kabupaten && (
                                                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                                                    <Map className="w-4 h-4 text-amber-500 shrink-0"/>
                                                    <span>{report.Kota_Kabupaten}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 shrink-0"/>
                                                <span>{Number(report.Latitude || 0).toFixed(4)}, {Number(report.Longitude || 0).toFixed(4)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-1">
                                            {String(report.Status).toUpperCase() !== "RESOLVED" ? (
                                                <button
                                                    onClick={() => report.ID_Laporan && setResolvingId(report.ID_Laporan)}
                                                    disabled={loading}
                                                    className="w-full text-center font-bold text-sm bg-amber-400 hover:bg-amber-500 text-slate-900 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                                                >
                                                    Tandai Laporan Selesai
                                                </button>
                                            ) : (
                                                <span className="w-full text-center text-sm text-emerald-600 font-semibold flex items-center justify-center gap-1.5 bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                                                    Tuntas Baik ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL MODERASI / FORM PENYELESAIAN */}
                {resolvingId && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                        <motion.form 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onSubmit={handleResolveSubmit} 
                            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 space-y-5"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <UploadCloud className="text-amber-500 w-6 h-6"/> Dokumen Penyelesaian
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">Lengkapi lampiran verifikasi untuk menutup berkas laporan ini.</p>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Instansi Pelaksana</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Misal: Dinas PUPR Kota Tangerang"
                                    value={instansi}
                                    onChange={(e) => setInstansi(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Foto Hasil Perbaikan</label>
                                <div className="border border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 text-center hover:bg-slate-100/50 transition-colors relative">
                                    <input 
                                        type="file" 
                                        required
                                        accept="image/*"
                                        onChange={(e) => setResolveFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-slate-900 hover:file:bg-amber-500 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setResolvingId(null)} 
                                    className="flex-1 py-3 rounded-xl text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 text-base transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="flex-1 py-3 rounded-xl text-slate-900 font-bold bg-amber-400 hover:bg-amber-500 text-base disabled:opacity-50 transition-all shadow-sm shadow-amber-400/10"
                                >
                                    {loading ? "Mengirim..." : "Kirim Bukti"}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
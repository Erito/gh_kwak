import { useState } from "react";
import { motion } from "framer-motion";
import { X, MapPin, AlertTriangle, Map, UploadCloud } from "lucide-react";
import type { Report } from "../types";

interface AdminDashboardProps {
    reports: Report[];
    onClose: () => void;
    // onUpdateProgress dihapus karena alur diubah
    onResolve: (id: string | number, instansi: string, file: File) => void;
    loading: boolean;
}

const StatusBadge = ({ status }: { status: string | undefined }) => {
    const safeStatus = (status || "PENDING").toUpperCase();
    const isResolved = safeStatus === "RESOLVED";
    
    return (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
            isResolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
            {isResolved ? "SELESAI" : "PENDING"}
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

    // State untuk mengontrol Modal Form Penyelesaian
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
            className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white">
                    <h2 className="text-xl font-bold text-slate-800">Admin Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-5 h-5 text-slate-600"/>
                    </button>
                </header>

                <div className="grow overflow-y-auto">
                    {sortedReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <AlertTriangle className="w-12 h-12 mb-3 text-slate-300"/>
                            <p className="font-medium text-lg">Belum ada data laporan</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3">ID Laporan</th>
                                    <th className="px-4 py-3">Detail Laporan</th>
                                    <th className="px-4 py-3">Lokasi</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedReports.map((report, idx) => (
                                    <tr key={report.ID_Laporan || idx} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-4 py-4 font-mono text-[11px] font-bold text-slate-800">
                                            #{String(report.ID_Laporan || "-").slice(0, 8)}
                                        </td>
                                        <td className="px-4 py-4 max-w-62.5">
                                            <p className="font-medium truncate mb-1">{report.Deskripsi}</p>
                                            {report.Instansi_Pelaksanaan && (
                                                <p className="text-[10px] text-slate-500 bg-green-50 p-1.5 rounded inline-block mt-1 border border-green-100">
                                                    <span className="font-bold text-green-700">Dikerjakan oleh: </span>{report.Instansi_Pelaksanaan}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                {report.Kota_Kabupaten && (
                                                    <div className="flex items-center gap-1 text-slate-800 font-bold">
                                                        <Map className="w-3 h-3 text-blue-500"/>
                                                        <span className="text-[11px]">{report.Kota_Kabupaten}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <MapPin className="w-3 h-3"/>
                                                    <span className="text-[10px]">{Number(report.Latitude || 0).toFixed(4)}, {Number(report.Longitude || 0).toFixed(4)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <StatusBadge status={report.Status}/>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {/* Logic Baru: Jika bukan RESOLVED, langsung munculkan tombol LAPOR SELESAI */}
                                            {String(report.Status).toUpperCase() !== "RESOLVED" ? (
                                                <button
                                                    onClick={() => report.ID_Laporan && setResolvingId(report.ID_Laporan)}
                                                    disabled={loading}
                                                    className="font-bold text-[10px] bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                                >
                                                    LAPOR SELESAI
                                                </button>
                                            ) : (
                                                <span className="text-xs text-green-500 font-bold flex items-center justify-center gap-1 bg-green-50 py-1.5 rounded-lg border border-green-100">
                                                    Tuntas ✓
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* MODAL FORM PENYELESAIAN */}
                {resolvingId && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <form onSubmit={handleResolveSubmit} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <UploadCloud className="text-green-500 w-5 h-5"/> Bukti Perbaikan
                            </h3>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Instansi Pelaksanaan</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Contoh: Dinas PUPR Tangerang"
                                    value={instansi}
                                    onChange={(e) => setInstansi(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Foto Bukti Perbaikan</label>
                                <input 
                                    type="file" 
                                    required
                                    accept="image/*"
                                    onChange={(e) => setResolveFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setResolvingId(null)} className="flex-1 py-2 rounded-lg text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 text-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 text-sm disabled:opacity-50">
                                    {loading ? "Mengirim..." : "Kirim Bukti"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
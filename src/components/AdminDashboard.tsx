import { motion } from "framer-motion";
import { X, MapPin, Clock, Loader, AlertTriangle, Map } from "lucide-react";
import type { Report } from "../types";

interface AdminDashboardProps {
    reports: Report[];
    onClose: () => void;
    onUpdateProgress: (id: string | number) => void;
    loading: boolean;
}

const StatusBadge = ({ status }: { status: string | undefined }) => {
    const safeStatus = (status || "UNKNOWN").toUpperCase();
    const statusStyles: Record<string, string> = {
        PENDING: "bg-red-100 text-red-700",
        ON_PROGRESS: "bg-yellow-100 text-yellow-700",
        RESOLVED: "bg-green-100 text-green-700",
    };
    const currentStyle = statusStyles[safeStatus] || "bg-slate-100 text-slate-700";
    return (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${currentStyle}`}>
            {safeStatus.replace("_", " ")}
        </span>
    );
};

export default function AdminDashboard({ reports, onClose, onUpdateProgress, loading }: AdminDashboardProps) {
    const safeReports = Array.isArray(reports) ? reports : [];
    const sortedReports = [...safeReports].sort((a, b) => {
        const timeA = a.Dibuat_Pada ? new Date(a.Dibuat_Pada).getTime() : 0;
        const timeB = b.Dibuat_Pada ? new Date(b.Dibuat_Pada).getTime() : 0;
        return timeB - timeA;
    });

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
                className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
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
                            <p className="text-sm mt-1">Atau data dari n8n sedang dimuat / gagal terhubung...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th scope="col" className="px-4 py-3">ID Laporan</th>
                                    <th scope="col" className="px-4 py-3">Pelapor</th>
                                    <th scope="col" className="px-4 py-3">Deskripsi & Analisis AI</th>
                                    <th scope="col" className="px-4 py-3">Lokasi (Kota)</th>
                                    <th scope="col" className="px-4 py-3">Waktu</th>
                                    <th scope="col" className="px-4 py-3 text-center">Status AI</th>
                                    <th scope="col" className="px-4 py-3 text-center">Status</th>
                                    <th scope="col" className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedReports.map((report, idx) => (
                                    <tr key={report.ID_Laporan || idx} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-4 py-4 font-mono text-[11px] font-bold text-slate-800">
                                            #{String(report.ID_Laporan || "-").slice(0, 8)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-slate-800">{report.Nama_Pelapor || "Anonim"}</p>
                                            {report.Level_Urgensi && (
                                                <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${String(report.Level_Urgensi).toLowerCase().includes('parah') ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {report.Level_Urgensi}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 max-w-62.5">
                                            <p className="font-medium truncate mb-1">{report.Deskripsi}</p>
                                            {report.Analisis_AI && (
                                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight bg-slate-100 p-1.5 rounded border border-slate-200">
                                                    <span className="font-bold text-slate-700">AI: </span>{report.Analisis_AI}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {/* Kolom Lokasi Diperbarui (Menambahkan Kota) */}
                                            {report.Kota_Kabupaten && (
                                                <div className="flex items-center gap-1 text-slate-800 font-bold mb-1">
                                                    <Map className="w-3 h-3 shrink-0 text-blue-500"/>
                                                    <span className="text-[11px]">{report.Kota_Kabupaten}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <MapPin className="w-3 h-3 shrink-0"/>
                                                <span className="text-[10px]">{Number(report.Latitude || 0).toFixed(4)}, {Number(report.Longitude || 0).toFixed(4)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Clock className="w-3 h-3 shrink-0"/>
                                                <span className="text-[11px]">{report.Dibuat_Pada ? new Date(report.Dibuat_Pada).toLocaleString('id-ID') : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-1 text-[9px] font-bold rounded-full ${String(report.Valid_AI).toLowerCase() === "true" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                                                {String(report.Valid_AI).toLowerCase() === "true" ? "AI VALID" : "INVALID"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <StatusBadge status={report.Status}/>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {String(report.Status).toUpperCase() === "PENDING" ? (
                                                <button
                                                    onClick={() => report.ID_Laporan && onUpdateProgress(report.ID_Laporan)}
                                                    disabled={loading}
                                                    className="font-bold text-[10px] bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                                                >
                                                    {loading ? <Loader className="w-3 h-3 animate-spin"/> : "PROSES"}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-bold">✓</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
import { motion } from "framer-motion";
import { X, MapPin, Clock, Loader } from "lucide-react";
import type { Report } from "../types";

interface AdminDashboardProps {
    reports: Report[];
    onClose: () => void;
    onUpdateProgress: (id: string | number) => void;
    loading: boolean;
}

const StatusBadge = ({ status }: { status: Report["Status"] }) => {
    // Penyesuaian agar kebal huruf kecil/besar dari Google Sheets
    const safeStatus = (status || "").toUpperCase();
    
    const statusStyles: Record<string, string> = {
        PENDING: "bg-red-100 text-red-700",
        ON_PROGRESS: "bg-yellow-100 text-yellow-700",
        RESOLVED: "bg-green-100 text-green-700",
    };
    
    const currentStyle = statusStyles[safeStatus] || "bg-slate-100 text-slate-700";

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentStyle}`}>
            {safeStatus.replace("_", " ")}
        </span>
    );
};

export default function AdminDashboard({ reports, onClose, onUpdateProgress, loading }: AdminDashboardProps) {
    
    // Perbaikan nama kolom untuk pengurutan tanggal (Dibuat_Pada)
    const sortedReports = [...reports].sort((a, b) => new Date(b.Dibuat_Pada).getTime() - new Date(a.Dibuat_Pada).getTime());

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
                className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Admin Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </header>

                <div className="grow overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Laporan</th>
                                <th scope="col" className="px-6 py-3">Deskripsi</th>
                                <th scope="col" className="px-6 py-3">Lokasi</th>
                                <th scope="col" className="px-6 py-3">Dilaporkan</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedReports.map((report) => (
                                <tr key={report.ID_Laporan} className="bg-white border-b hover:bg-slate-50">
                                    {/* Menggunakan ID_Laporan */}
                                    <td className="px-6 py-4 font-mono text-xs">#{String(report.ID_Laporan).slice(0, 8)}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{report.Deskripsi}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <MapPin className="w-3 h-3" />
                                            <span>{Number(report.Latitude).toFixed(4)}, {Number(report.Longitude).toFixed(4)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Clock className="w-3 h-3" />
                                            {/* Menggunakan Dibuat_Pada */}
                                            <span>{new Date(report.Dibuat_Pada).toLocaleString('id-ID')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.Status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {String(report.Status).toUpperCase() === "PENDING" && (
                                            <button
                                                onClick={() => onUpdateProgress(report.ID_Laporan)}
                                                disabled={loading}
                                                className="font-medium text-yellow-600 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                                            >
                                                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Set On Progress"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
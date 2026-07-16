import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Loader, AlertTriangle, Map, Send, Building, Upload } from "lucide-react";
import type { Report } from "../types";

interface AdminDashboardProps {
    reports: Report[];
    onClose: () => void;
    onSubmitFeedback: (payload: any) => Promise<void>;
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

// ==========================================
// 📋 SUB-KOMPONEN: MODAL FORM INPUT RESPONS ADMIN
// ==========================================
interface FeedbackModalProps {
    report: Report;
    onClose: () => void;
    onSubmit: (payload: any) => Promise<void>;
    loading: boolean;
}

const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";

function FeedbackModal({ report, onClose, onSubmit, loading }: FeedbackModalProps) {
    const [status, setStatus] = useState("RESOLVED");
    const [catatan, setCatatan] = useState("");
    const [instansi, setInstansi] = useState("");
    
    // State untuk file gambar & upload status
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isRequired = status === "RESOLVED";

    // Helper preview lokal sebelum di-upload ke ImgBB
    const handleFile = (file: File) => {
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Format file tidak didukung. Harap masukkan file gambar JPG atau PNG.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Fungsi upload file fisik ke ImgBB API
    const uploadToImgBB = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal mengunggah gambar ke server penyimpanan.");
            }

            const data = await response.json();
            return data.data.url; // Mengembalikan URL gambar online langsung (direct link)
        } catch (error) {
            console.error("ImgBB Upload Error:", error);
            alert("Terjadi kesalahan saat mengunggah gambar ke server cloud. Silakan coba lagi.");
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isRequired && (!catatan.trim() || !instansi.trim())) {
            return alert("Untuk status RESOLVED, Catatan dan Instansi wajib diisi!");
        }

        setIsUploading(true);
        let uploadedImageUrl: string | null = null;

        // Jika user memilih file, upload ke ImgBB terlebih dahulu
        if (imageFile) {
            uploadedImageUrl = await uploadToImgBB(imageFile);
            if (!uploadedImageUrl) {
                setIsUploading(false);
                return; // Batalkan submit jika upload gambar gagal
            }
        }

        try {
            await onSubmit({
                ID_Laporan: report.ID_Laporan,
                Status: status,
                Catatan_Admin: catatan.trim() ? catatan : null,
                Instansi_Pelaksana: instansi.trim() ? instansi : null,
                // Mengirimkan URL online hasil upload ImgBB, atau null jika tidak ada foto
                Foto_Perbaikan: uploadedImageUrl, 
            });
            onClose();
        } catch (error) {
            console.error("Error submitting feedback:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const isButtonDisabled = loading || isUploading;

    return (
        <div className="fixed inset-0 bg-black/60 z-150 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
                <header className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-sm">Form Tindak Lanjut Respons</h3>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">ID: #{report.ID_Laporan}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition-colors">
                        <X className="w-4 h-4"/>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                    {/* Status Pilihan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Update Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="ON_PROGRESS">ON PROGRESS (Sedang Dikerjakan)</option>
                            <option value="RESOLVED">RESOLVED (Selesai Diperbaiki)</option>
                        </select>
                    </div>

                    {/* Instansi Pelaksana */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Instansi Pelaksana {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                            <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                            <input 
                                type="text"
                                value={instansi}
                                onChange={(e) => setInstansi(e.target.value)}
                                placeholder="Contoh: Dinas Bina Marga Jakarta Timur"
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500"
                                required={isRequired}
                            />
                        </div>
                    </div>

                    {/* Catatan Admin Lapangan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Catatan Admin Lapangan {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <textarea 
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Tulis instruksi teknis singkat. Contoh: Penambalan lubang aspal jalan selesai dikerjakan menggunakan aspal hotmix."
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-blue-500 resize-none"
                            required={isRequired}
                        />
                    </div>

                    {/* 📸 INPUT AREA DRAG AND DROP FOTO PERBAIKAN */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Foto Perbaikan (JPG/PNG)</label>
                        
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                        />

                        {!imagePreview ? (
                            <div 
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    isDragActive 
                                        ? "border-blue-500 bg-blue-50" 
                                        : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                                }`}
                            >
                                <Upload className={`w-8 h-8 mb-2 transition-colors ${isDragActive ? "text-blue-500" : "text-slate-400"}`} />
                                <p className="text-xs font-semibold text-slate-700 text-center">
                                    Seret & taruh foto di sini, atau <span className="text-blue-600">pilih file</span>
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">Mendukung format JPG, JPEG, PNG</p>
                            </div>
                        ) : (
                            <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview Perbaikan" 
                                        className="w-12 h-12 rounded object-cover border border-slate-300"
                                    />
                                    <div className="overflow-hidden max-w-[200px]">
                                        <p className="text-xs font-semibold text-slate-700 truncate">
                                            {imageFile?.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : ""}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Hapus foto"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tombol Aksi Akhir */}
                    <div className="pt-2 flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isButtonDisabled}
                            className="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={isButtonDisabled}
                            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isButtonDisabled ? (
                                <>
                                    <Loader className="w-3 h-3 animate-spin"/>
                                    {isUploading ? "Mengunggah..." : "Memproses..."}
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3"/>
                                    Kirim Respons Ke AI
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ==========================================
// 🏛️ KOMPONEN UTAMA: ADMIN DASHBOARD
// ==========================================
export default function AdminDashboard({ reports, onClose, onSubmitFeedback, loading }: AdminDashboardProps) {
    const safeReports = Array.isArray(reports) ? reports : [];
    const [selectedReportForFeedback, setSelectedReportForFeedback] = useState<Report | null>(null);

    const sortedReports = [...safeReports].sort((a, b) => {
        const timeA = a.Dibuat_Pada ? new Date(a.Dibuat_Pada).getTime() : 0;
        const timeB = b.Dibuat_Pada ? new Date(b.Dibuat_Pada).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <>
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
                                                <span className={`px-2 py-1 text-[9px] font-bold rounded-full ${String(report.Valid_AI).toLowerCase() === "true" || report.Valid_AI === true ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                                                    {String(report.Valid_AI).toLowerCase() === "true" || report.Valid_AI === true ? "AI VALID" : "INVALID"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <StatusBadge status={report.Status}/>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {String(report.Status).toUpperCase() !== "RESOLVED" ? (
                                                    <button
                                                        onClick={() => setSelectedReportForFeedback(report)}
                                                        disabled={loading}
                                                        className="font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                                                    >
                                                        RESPONS
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-bold">✓ Selesai</span>
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

            {/* Render Modal Input Form Respons secara kondisional */}
            <AnimatePresence>
                {selectedReportForFeedback && (
                    <FeedbackModal
                        report={selectedReportForFeedback}
                        loading={loading}
                        onClose={() => setSelectedReportForFeedback(null)}
                        onSubmit={onSubmitFeedback}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
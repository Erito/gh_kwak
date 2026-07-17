import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, UploadCloud, AlertCircle } from "lucide-react"; // Tambahkan AlertCircle
import type { Location, FormDataState } from "../types";

interface ReportFormProps {
    newLocation: Location | null;
    form: FormDataState;
    setForm: Dispatch<SetStateAction<FormDataState>>;
    handleLapor: (e: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function ReportForm({ newLocation, form, setForm, handleLapor, loading }: ReportFormProps) {
    // 1. Tambahkan state untuk mengontrol pop-up konfirmasi
    const [showConfirm, setShowConfirm] = useState(false);

    // 2. Fungsi untuk menahan submit dan menampilkan pop-up
    const handlePreSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    // 3. Fungsi untuk mengeksekusi submit asli jika user setuju
    const confirmSubmit = () => {
        setShowConfirm(false);
        // Mengirimkan "dummy event" karena handleLapor asli membutuhkan parameter FormEvent
        handleLapor({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    };

    return (
        <div className="lg:col-span-1">
            {/* --- MODAL KONFIRMASI (POP-UP KEREN) --- */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Laporan</h3>
                            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                                Pastikan detail kerusakan dan foto yang dilampirkan sudah sesuai. Laporan yang dikirim akan langsung dianalisis oleh AI.
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cek Lagi
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSubmit}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30 transition-all"
                                >
                                    Ya, Kirim
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* --------------------------------------- */}

            <AnimatePresence mode="wait">
                {newLocation ? (
                    <motion.div
                        key="form-active"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 sticky top-24"
                    >
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <MapPin className="w-5 h-5" />
                            <h3 className="text-lg font-bold">Kirim Laporan Baru</h3>
                        </div>

                        {/* 4. Ubah onSubmit menjadi handlePreSubmit */}
                        <form onSubmit={handlePreSubmit} className="flex flex-col gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between text-xs font-mono text-slate-500">
                                <span>Lat: {newLocation.lat.toFixed(5)}</span>
                                <span>Lng: {newLocation.lng.toFixed(5)}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Detail Kerusakan</label>
                                <textarea
                                    placeholder="Contoh: Lubang sedalam 15cm di tengah jalan..."
                                    required
                                    rows={3}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Unggah Foto Lokasi</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500 font-semibold text-center px-4">
                                            {form.file ? form.file.name : "Klik untuk pilih foto"}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setForm({ ...form, file: e.target.files[0] });
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full mt-2 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all disabled:opacity-50"
                            >
                                {loading ? "AI Sedang Menganalisis..." : "Kirim Laporan Sekarang"}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl h-150 flex flex-col items-center justify-center p-8 text-center text-slate-500"
                    >
                        <MapPin className="w-12 h-12 mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Pilih Titik di Peta</h3>
                        <p className="text-sm">Klik pada area jalan yang rusak di peta untuk mulai membuat laporan baru.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
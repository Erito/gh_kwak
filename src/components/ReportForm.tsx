import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Upload, AlertCircle } from "lucide-react"; 
import type { Location, FormDataState } from "../types";

interface ReportFormProps {
    newLocation: Location | null;
    form: FormDataState;
    setForm: Dispatch<SetStateAction<FormDataState>>;
    handleLapor: (e: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function ReportForm({ newLocation, form, setForm, handleLapor, loading }: ReportFormProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handlePreSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        setShowConfirm(false);
        handleLapor({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    };

    return (
        <div className="lg:col-span-1">
            <AnimatePresence>
                {/* MODAL KONFIRMASI */}
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Laporan</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Pastikan detail kerusakan dan foto yang dilampirkan sudah sesuai. Laporan akan dianalisis oleh AI.
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cek Lagi
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSubmit}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-slate-900 bg-[#FBD715] hover:bg-[#e5c30b] shadow-lg shadow-yellow-500/20 transition-all"
                                >
                                    Ya, Kirim
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {newLocation ? (
                    <motion.div
                        key="form-active"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 sticky top-24"
                    >
                        {/* HEADER FORM */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                            <MapPin className="w-5 h-5 text-[#FBD715]" />
                            <h3 className="text-lg font-bold text-slate-900">Kirim Laporan Baru</h3>
                        </div>

                        {/* Gap diperkecil jadi gap-3 */}
                        <form onSubmit={handlePreSubmit} className="flex flex-col gap-3">
                            
                            {/* INPUT NAMA */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pelapor</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama Anda"
                                    required
                                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FBD715] focus:border-[#FBD715] outline-none shadow-sm transition-all"
                                    value={form.namaPelapor}
                                    onChange={(e) => setForm({ ...form, namaPelapor: e.target.value })}
                                />
                            </div>

                            {/* INPUT NOMOR HP */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon (WA)</label>
                                <input
                                    type="tel"
                                    placeholder="Contoh: 081234567890"
                                    required
                                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FBD715] focus:border-[#FBD715] outline-none shadow-sm transition-all"
                                    value={form.telpPelapor}
                                    onChange={(e) => setForm({ ...form, telpPelapor: e.target.value })}
                                />
                            </div>

                            {/* KOORDINAT LAT/LNG (Lebih tipis) */}
                            <div className="bg-[#fef1b5] py-2 px-4 rounded-xl flex justify-around text-xs font-bold text-slate-800 shadow-sm">
                                <span>Lat: <span className="font-normal ml-1">{newLocation.lat.toFixed(4)}</span></span>
                                <span>Lng: <span className="font-normal ml-1">{newLocation.lng.toFixed(4)}</span></span>
                            </div>

                            {/* INPUT DETAIL KERUSAKAN (Rows jadi 2) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Detail Kerusakan</label>
                                <textarea
                                    placeholder="Contoh: Lubang sedalam 15cm..."
                                    required
                                    rows={2}
                                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FBD715] focus:border-[#FBD715] outline-none resize-none shadow-sm transition-all"
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                />
                            </div>

                            {/* UPLOAD FOTO (Tinggi dikurangi jadi h-20) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Unggah Foto Lokasi</label>
                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors shadow-sm">
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="w-5 h-5 text-slate-500 mb-1" />
                                        <p className="text-[11px] text-slate-500 font-medium text-center px-4 truncate w-full">
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

                            {/* TOMBOL SUBMIT */}
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full mt-1 bg-[#FBD715] hover:bg-[#e5c30b] text-slate-900 font-bold py-3 text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
                            >
                                {loading ? "Menganalisis..." : "Kirim Laporan Sekarang"}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl h-87.5 flex flex-col items-center justify-center p-6 text-center text-slate-500 sticky top-24"
                    >
                        <MapPin className="w-10 h-10 mb-3 text-slate-300" />
                        <h3 className="text-base font-bold text-slate-700 mb-1">Pilih Titik di Peta</h3>
                        <p className="text-xs">Klik pada area jalan yang rusak di peta untuk mulai membuat laporan baru.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
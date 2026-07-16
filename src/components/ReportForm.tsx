import type { Dispatch, FormEvent, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, UploadCloud } from "lucide-react";
import type { Location, FormDataState } from "../types";

interface ReportFormProps {
    newLocation: Location | null;
    form: FormDataState;
    setForm: Dispatch<SetStateAction<FormDataState>>;
    handleLapor: (e: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function ReportForm({ newLocation, form, setForm, handleLapor, loading }: ReportFormProps) {
    return (
        <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
                {newLocation ? (
                    <motion.div
                        key="form-active"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 sticky top-24"
                    >
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <MapPin className="w-5 h-5" />
                            <h3 className="text-lg font-bold">Kirim Laporan Baru</h3>
                        </div>

                        <form onSubmit={handleLapor} className="flex flex-col gap-4">
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
                                        <p className="text-sm text-slate-500 font-semibold">{form.file ? form.file.name : "Klik untuk pilih foto"}</p>
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

                            <button type="submit" disabled={loading} className="w-full mt-2 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all disabled:opacity-50">
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
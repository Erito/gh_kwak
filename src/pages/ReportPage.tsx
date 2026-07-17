import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import ReportForm from "../components/ReportForm";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import type { Report, Location, FormDataState, NominatimResponse } from "../types";

const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";
const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_LAPOR = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/lapor";
const N8N_WEBHOOK_POST_SELESAI = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/perbaikan";

export default function ReportPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [newLocation, setNewLocation] = useState<Location | null>(null);
    const [form, setForm] = useState<FormDataState>({ deskripsi: "", file: null });
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2574, 106.6183]);
    const [showReturnHome, setShowReturnHome] = useState<boolean>(false);
    const navigate = useNavigate();
    
    // Mobile: toggle between map and form
    const [mobileView, setMobileView] = useState<"map" | "form">("map");

    const fetchReports = async () => {
        setPageLoading(true);
        try {
            const res = await fetch(N8N_WEBHOOK_GET);
            const data: Report[] = await res.json();
            setReports(data || []);
        } catch (err) {
            console.error("Gagal ambil data", err);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery) return;
        try {
            if (searchQuery.includes(",")) {
                const [lat, lng] = searchQuery.split(",").map(Number);
                if (!isNaN(lat) && !isNaN(lng)) {
                    setMapCenter([lat, lng]);
                    setNewLocation({ lat, lng });
                    return;
                }
            }
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data: NominatimResponse[] = await res.json();
            if (data && data.length > 0) {
                setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            } else {
                toast.error("Lokasi tidak ditemukan!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal melakukan pencarian lokasi.");
        }
    };

    const uploadToImgBB = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const data = await res.json();
        return data.data.url;
    };

    const handleLapor = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault() sudah tidak diperlukan di sini karena sudah dicegah di ReportForm, 
        // tapi dibiarkan sebagai pelindung ekstra juga tidak apa-apa
        e.preventDefault?.(); 

        if (!newLocation || !form.file) {
            toast.error("Pilih lokasi di peta dan unggah foto bukti.");
            return;
        }

        // BAGIAN INI YANG SAYA HAPUS:
        // window.confirm("Apakah data yang kamu isi benar?") (x2)

        setLoading(true);
        setShowReturnHome(false);
        const toastId = toast.loading("Mengirim laporan dan menganalisis gambar...");
        
        try {
            const foto_url = await uploadToImgBB(form.file);
            const res = await fetch(N8N_WEBHOOK_POST_LAPOR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude: newLocation.lat,
                    longitude: newLocation.lng,
                    deskripsi: form.deskripsi,
                    foto_url,
                }),
            });
            
            if (res.ok) {
                toast.success("Berhasil! Laporan Anda telah diterima.", { id: toastId });
                setNewLocation(null);
                setForm({ deskripsi: "", file: null });
                setShowReturnHome(true);
                fetchReports();
            } else {
                toast.error("Laporan ditolak. AI mendeteksi gambar bukan jalan rusak.", { id: toastId });
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem. Coba lagi nanti.", { id: toastId });
        }
        
        setLoading(false);
    };

    const handleAdminUpdate = async (id: string | number, file: File) => {
        setLoading(true);
        const toastId = toast.loading("Memperbarui status dan menganalisis gambar...");
        try {
            const foto_url = await uploadToImgBB(file);
            const res = await fetch(N8N_WEBHOOK_POST_SELESAI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, foto_url }),
            });
            if (res.ok) {
                toast.success("Status laporan berhasil diperbarui!", { id: toastId });
                fetchReports();
            } else {
                toast.error("Update ditolak. AI mendeteksi ini bukan foto perbaikan aspal.", { id: toastId });
            }
        } catch (err) {
            toast.error("Terjadi kesalahan. Gagal memperbarui status.", { id: toastId });
        }
        setLoading(false);
    };

    // When user picks location on map, auto-switch to form on mobile
    const handleSetNewLocation = (loc: Location | null) => {
        setNewLocation(loc);
        setShowReturnHome(false);
        if (loc) setMobileView("form");
    };

    const handleReturnHome = () => {
        navigate("/");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-100 flex flex-col"
        >
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />

            <main className="grow max-w-7xl mx-auto w-full px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28 pb-4 md:pb-8">
                
                {/* Mobile Tab Switcher */}
                <div className="flex lg:hidden mb-3 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                    <button
                        onClick={() => setMobileView("map")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                            mobileView === "map" ? "bg-slate-800 text-white shadow" : "text-slate-500"
                        }`}
                    >
                        <Map className="w-4 h-4" />
                        Peta
                    </button>
                    <button
                        onClick={() => setMobileView("form")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                            mobileView === "form" ? "bg-red-500 text-white shadow" : "text-slate-500"
                        }`}
                    >
                        Formulir Laporan
                        {newLocation && <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
                    </button>
                </div>

                {pageLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Skeleton Map */}
                        <div className="lg:col-span-2 bg-slate-200 rounded-2xl animate-pulse h-[55vh] md:h-[65vh] lg:h-[75vh]"></div>
                        {/* Skeleton Form */}
                        <div className="lg:col-span-1 bg-slate-200 rounded-2xl animate-pulse h-64 lg:h-[75vh]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Map - hidden on mobile when form view is active */}
                        <div className={`lg:block lg:col-span-2 ${mobileView === "map" ? "block" : "hidden"}`}>
                            <MapComponent
                                mapCenter={mapCenter}
                                reports={reports}
                                newLocation={newLocation}
                                setNewLocation={handleSetNewLocation}
                                handleAdminUpdate={handleAdminUpdate}
                                loading={loading}
                            />
                        </div>
                        {/* Form - hidden on mobile when map view is active */}
                        <div className={`lg:block lg:col-span-1 ${mobileView === "form" ? "block" : "hidden"}`}>
                            {showReturnHome && (
                                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
                                    <p className="font-semibold mb-2">Laporan berhasil dikirim.</p>
                                    <button
                                        type="button"
                                        onClick={handleReturnHome}
                                        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                    >
                                        Kembali ke Halaman Utama
                                    </button>
                                </div>
                            )}
                            <ReportForm newLocation={newLocation} form={form} setForm={setForm} handleLapor={handleLapor} loading={loading} />
                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );
}
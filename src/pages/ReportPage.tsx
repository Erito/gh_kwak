import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import ReportForm from "../components/ReportForm";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import type { Report, Location, FormDataState, NominatimResponse } from "../types";

const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";
// Menggunakan URL production (tanpa -test)
const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_LAPOR = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/lapor";
const N8N_WEBHOOK_POST_SELESAI = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/perbaikan";

export default function ReportPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [newLocation, setNewLocation] = useState<Location | null>(null);
    const [form, setForm] = useState<FormDataState>({ deskripsi: "", file: null });
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true); // State untuk loading awal
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2574, 106.6183]);

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
        e.preventDefault();
        if (!newLocation || !form.file) {
            toast.error("Pilih lokasi di peta dan unggah foto bukti.");
            return;
        }
        setLoading(true);
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
            
            <main className="grow max-w-7xl mx-auto w-full px-4 pt-28 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {pageLoading ? (
                        <>
                            {/* Skeleton untuk Map */}
                            <div className="lg:col-span-2 bg-slate-200 rounded-2xl animate-pulse h-[75vh]"></div>
                            {/* Skeleton untuk Form */}
                            <div className="lg:col-span-1 bg-slate-200 rounded-2xl animate-pulse h-96 lg:h-[75vh]"></div>
                        </>
                    ) : (
                        <>
                            <MapComponent
                                mapCenter={mapCenter}
                                reports={reports}
                                newLocation={newLocation}
                                setNewLocation={setNewLocation}
                                handleAdminUpdate={handleAdminUpdate}
                                loading={loading}
                            />
                            <ReportForm newLocation={newLocation} form={form} setForm={setForm} handleLapor={handleLapor} loading={loading} />
                        </>
                    )}
                </div>
            </main>
        </motion.div>
    );
}
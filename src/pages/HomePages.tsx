import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ReportCardSkeleton from "../components/ReportCardSkeleton";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import type { Report } from "../types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";

export default function HomePages() {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("Semua Wilayah");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(N8N_WEBHOOK_GET);
                const data: Report[] = await res.json();
                setReports(data || []);
            } catch (err) {
                console.error("Gagal ambil data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const uniqueCities = ["Semua Wilayah", ...Array.from(new Set(reports.map(r => r.Kota_Kabupaten).filter(Boolean)))];

    const filteredReports = selectedCity === "Semua Wilayah"
        ? reports
        : reports.filter(r => r.Kota_Kabupaten === selectedCity);

    const defaultCenter: [number, number] = [-6.2574, 106.6183];
    const mapCenter = filteredReports.length > 0 && filteredReports[0].Latitude && filteredReports[0].Longitude
        ? [Number(filteredReports[0].Latitude), Number(filteredReports[0].Longitude)] as [number, number]
        : defaultCenter;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-50"
        >
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 pt-20 sm:pt-24 md:pt-32 pb-12">
                {/* Header & Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Informasi Jalan Rusak</h1>
                        <p className="text-slate-500 mt-1 text-sm md:text-base">Pantau sebaran laporan infrastruktur jalan di berbagai wilayah.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 w-full sm:w-auto">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                        <select
                            className="bg-transparent border-none outline-none text-slate-700 font-semibold cursor-pointer text-sm md:text-base w-full sm:w-auto"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            {uniqueCities.map((city, idx) => (
                                <option key={idx} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <>
                        <div className="w-full h-56 sm:h-72 md:h-100 bg-slate-200 rounded-2xl animate-pulse mb-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ReportCardSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* MAP AREA */}
                        <div className="w-full h-56 sm:h-72 md:h-100 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-6 md:mb-8 z-0 relative">
                            <MapContainer
                                center={mapCenter}
                                zoom={12}
                                scrollWheelZoom={true}
                                className="w-full h-full"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {filteredReports.map((r, idx) => {
                                    if (!r.Latitude || !r.Longitude) return null;
                                    return (
                                        <Marker key={r.ID_Laporan || idx} position={[Number(r.Latitude), Number(r.Longitude)]}>
                                            <Popup>
                                                <div className="p-1 max-w-50">
                                                    <span className={`inline-block px-2 py-1 mb-2 text-[10px] font-bold rounded-md ${
                                                        r.Status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {String(r.Status || "PENDING")}
                                                    </span>
                                                    <p className="text-sm font-bold text-slate-800 line-clamp-2">{r.Deskripsi}</p>
                                                    {r.Foto_Lapor && (
                                                        <img src={r.Foto_Lapor} alt="Bukti" className="w-full h-20 object-cover mt-2 rounded-md border" />
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        </div>

                        {/* GRID CARDS AREA */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredReports.map((report, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                                    <img src={report.Foto_Lapor} alt="Jalan rusak" className="w-full h-40 sm:h-48 object-cover shrink-0" />
                                    <div className="p-4 md:p-5 flex flex-col grow">
                                        <div className="flex justify-between items-start mb-3 shrink-0">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                                                report.Status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                                {String(report.Status || "PENDING")}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                {report.Level_Urgensi || "Normal"}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 shrink-0 text-sm md:text-base">{report.Deskripsi}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 mb-4 shrink-0">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-xs font-medium">{report.Kota_Kabupaten || "Lokasi tidak diketahui"}</span>
                                        </div>
                                        {report.Analisis_AI && (
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-auto">
                                                <p className="text-[10px] text-blue-800 line-clamp-3"><span className="font-bold">AI: </span>{report.Analisis_AI}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredReports.length === 0 && (
                                <div className="col-span-full text-center py-16 md:py-20 text-slate-500">
                                    Tidak ada laporan di wilayah ini.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </motion.div>
    );
}
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

// --- TypeScript Interfaces ---
interface Report {
  ID: string | number;
  Latitude: number;
  Longitude: number;
  Deskripsi: string;
  Status: "PENDING" | "RESOLVED";
  Foto_Lapor: string;
  Foto_Perbaikan?: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface FormDataState {
  deskripsi: string;
  file: File | null;
}

interface NominatimResponse {
  lat: string;
  lon: string;
}

interface MapControllerProps {
  center: [number, number];
}
// -----------------------------

// Perbaikan Icon Leaflet
// @ts-ignore (Mengabaikan error TS karena _getIconUrl tidak ada di definisi tipe standar Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Kredensial
const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";
const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_LAPOR = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/lapor";
const N8N_WEBHOOK_POST_SELESAI = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/perbaikan";

// Komponen untuk menggeser peta secara dinamis
const MapController: React.FC<MapControllerProps> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [newLocation, setNewLocation] = useState<Location | null>(null);
  const [form, setForm] = useState<FormDataState>({ deskripsi: "", file: null });
  const [adminFile, setAdminFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2574, 106.6183]); // Default Tangerang
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchReports = async () => {
    try {
      const res = await fetch(N8N_WEBHOOK_GET);
      const data: Report[] = await res.json();
      
      console.log("Data dari n8n:", data); 
      setReports(data || []);
    } catch (err) {
      console.error("Gagal ambil data", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const LocationPicker = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        setNewLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return newLocation === null ? null : (
      <Marker position={[newLocation.lat, newLocation.lng]} icon={redIcon}>
        <Popup>Laporan Baru di Sini</Popup>
      </Marker>
    );
  };

  // Fungsi Pencarian Lokasi
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);

    try {
      // Cek apakah input berupa koordinat (mengandung koma)
      if (searchQuery.includes(",")) {
        const [lat, lng] = searchQuery.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
          setNewLocation({ lat, lng });
          setIsSearching(false);
          return;
        }
      }

      // Jika bukan koordinat, cari berdasarkan nama tempat pakai OpenStreetMap API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data: NominatimResponse[] = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapCenter([lat, lng]);
      } else {
        alert("Lokasi tidak ditemukan!");
      }
    } catch (error) {
      console.error(error);
    }
    setIsSearching(false);
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
    if (!newLocation || !form.file) return alert("Pilih lokasi dan foto!");
    setLoading(true);

    try {
      const foto_url = await uploadToImgBB(form.file);
      const res = await fetch(N8N_WEBHOOK_POST_LAPOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          latitude: newLocation.lat, 
          longitude: newLocation.lng, 
          deskripsi: form.deskripsi, 
          foto_url 
        }),
      });

      if (res.ok) {
        alert("Berhasil! Laporan diterima.");
        setNewLocation(null);
        setForm({ deskripsi: "", file: null });
        fetchReports();
      } else {
        alert("Ditolak! AI mendeteksi gambar bukan jalan rusak.");
      }
    } catch (err) { 
      alert("Terjadi kesalahan sistem."); 
    }
    setLoading(false);
  };

  const handleAdminUpdate = async (id: string | number) => {
    if (!adminFile) return alert("Masukkan foto bukti perbaikan!");
    setLoading(true);

    try {
      const foto_url = await uploadToImgBB(adminFile);
      const res = await fetch(N8N_WEBHOOK_POST_SELESAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, foto_url }),
      });

      if (res.ok) {
        alert("Status berhasil diupdate!");
        setAdminFile(null);
        fetchReports();
      } else {
        alert("Ditolak! AI mendeteksi ini bukan foto perbaikan aspal.");
      }
    } catch (err) { 
      alert("Terjadi kesalahan."); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500 w-8 h-8" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
              LaporJalan.id
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Cari lokasi atau Lat, Lng..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
            <button type="submit" className="absolute right-1 top-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors disabled:bg-slate-300">
              {isSearching ? "Mencari..." : "Cari"}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          
          {/* Peta Section */}
          <div className="lg:col-span-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-[600px] z-0">
            <MapContainer center={mapCenter} zoom={13} className="h-full w-full rounded-xl" zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController center={mapCenter} />
              <LocationPicker />
              
              {reports.map((r, idx) => (
                <Marker key={idx} position={[r.Latitude, r.Longitude]} icon={r.Status === "RESOLVED" ? greenIcon : redIcon}>
                  <Popup className="custom-popup">
                    <div className="p-1 min-w-[200px]">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2 ${r.Status === "RESOLVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.Status === "RESOLVED" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {r.Status}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{r.Deskripsi}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Bukti Warga</p>
                          <img src={r.Foto_Lapor} className="w-full h-16 object-cover rounded-md border" alt="rusak" />
                        </div>
                        {r.Foto_Perbaikan && (
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Hasil Perbaikan</p>
                            <img src={r.Foto_Perbaikan} className="w-full h-16 object-cover rounded-md border" alt="selesai" />
                          </div>
                        )}
                      </div>

                      {r.Status === "PENDING" && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <p className="text-xs font-bold text-slate-700 mb-2">Pemerintah / Admin Area</p>
                          <input 
                            type="file" 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setAdminFile(e.target.files[0]);
                              }
                            }} 
                            className="text-xs w-full mb-2 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-700" 
                          />
                          <button onClick={() => handleAdminUpdate(r.ID)} disabled={loading} className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2 rounded-md transition-colors">
                            {loading ? "Memproses..." : "Update Status: Selesai"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Form Section (Sticky/Animasi) */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {newLocation ? (
                <motion.div 
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
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, deskripsi: e.target.value })}
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setForm({ ...form, file: e.target.files[0] });
                            }
                          }} 
                        />
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all disabled:opacity-50">
                      {loading ? "AI Sedang Menganalisis..." : "Kirim Laporan Sekarang"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl h-[600px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <MapPin className="w-12 h-12 mb-4 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Pilih Titik di Peta</h3>
                  <p className="text-sm">Klik pada area jalan yang rusak di peta untuk mulai membuat laporan baru.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
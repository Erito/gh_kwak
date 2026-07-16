import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Komponen
import Header from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import ReportForm from "../components/ReportForm";
import AdminDashboard from "../components/AdminDashboard";

// Types
import type { Report, Location, FormDataState, NominatimResponse } from "../types";

// Kredensial & Endpoints
const IMGBB_API_KEY = "eb35e048c700026796fb17f3edfb4d43";
const N8N_WEBHOOK_GET = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/laporan";
const N8N_WEBHOOK_POST_LAPOR = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/lapor";
const N8N_WEBHOOK_POST_ON_PROGRESS = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/on-progress";
const N8N_WEBHOOK_POST_SELESAI = "https://titusericson.app.n8n.cloud/webhook-test/jalan-rusak/perbaikan";

export default function ReportPage() {

  const [reports, setReports] = useState<Report[]>([]);
  const [newLocation, setNewLocation] = useState<Location | null>(null);
  const [form, setForm] = useState<FormDataState>({ deskripsi: "", file: null });
  const [loading, setLoading] = useState<boolean>(false);

  // State pencarian
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2574, 106.6183]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // State Admin Dashboard
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  const fetchReports = async () => {
    try {
      const res = await fetch(N8N_WEBHOOK_GET);
      const data: Report[] = await res.json();
      setReports(data || []);
    } catch (err) {
      console.error("Gagal ambil data", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);

    try {
      if (searchQuery.includes(",")) {
        const [lat, lng] = searchQuery.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
          setNewLocation({ lat, lng });
          setIsSearching(false);
          return;
        }
      }

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
          foto_url,
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

  const handleAdminUpdateProgress = async (id: string | number) => {
    setLoading(true);
    try {
      const res = await fetch(N8N_WEBHOOK_POST_ON_PROGRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert("Status berhasil diupdate menjadi 'On Progress'!");
        fetchReports();
      } else {
        alert("Gagal mengupdate status.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    }
    setLoading(false);
  };

  // Diubah: Menerima adminFile langsung dari MapComponent
  const handleAdminUpdate = async (id: string | number, file: File) => {
    setLoading(true);
    try {
      const foto_url = await uploadToImgBB(file);
      const res = await fetch(N8N_WEBHOOK_POST_SELESAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, foto_url }),
      });

      if (res.ok) {
        alert("Status berhasil diupdate!");
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
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        onLogoClick={() => setIsAdminDashboardOpen(true)}
      />

      <AnimatePresence>
        {isAdminDashboardOpen && (
          <AdminDashboard
            reports={reports}
            onClose={() => setIsAdminDashboardOpen(false)}
            onUpdateProgress={handleAdminUpdateProgress}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <>
            <MapComponent
              mapCenter={mapCenter}
              reports={reports}
              newLocation={newLocation}
              setNewLocation={setNewLocation}
              handleAdminUpdate={handleAdminUpdate}
              loading={loading}
            />

            <ReportForm
              newLocation={newLocation}
              form={form}
              setForm={setForm}
              handleLapor={handleLapor}
              loading={loading}
            />
          </>
        </div>
      </main>
    </div>
  );
}
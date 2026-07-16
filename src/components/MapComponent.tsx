import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle2, AlertCircle, Wrench } from "lucide-react";
import type { Report, Location } from "../types";

// --- Setup Icon Leaflet ---
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// --- Controller Helper ---
const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
};

interface MapComponentProps {
    mapCenter: [number, number];
    reports: Report[];
    newLocation: Location | null;
    setNewLocation: (loc: Location | null) => void;
    handleAdminUpdate: (id: string | number, file: File) => void;
    loading: boolean;
}

export default function MapComponent({ mapCenter, reports, newLocation, setNewLocation, handleAdminUpdate, loading }: MapComponentProps) {
    // State lokal untuk file perbaikan per popup
    const [adminFile, setAdminFile] = useState<File | null>(null);

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

    return (
        <div className="lg:col-span-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-150 z-0">
            <MapContainer center={mapCenter} zoom={13} className="h-full w-full rounded-xl" zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={mapCenter} />
                <LocationPicker />

                {reports.map((r, idx) => (
                    <Marker key={idx} position={[r.Latitude, r.Longitude]} icon={r.Status === "RESOLVED" ? greenIcon : redIcon}>
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-50">
                                <div
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-2 ${
                                        r.Status === "RESOLVED"
                                            ? "bg-green-100 text-green-700"
                                            : r.Status === "ON_PROGRESS"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {r.Status === "RESOLVED" ? (
                                        <CheckCircle2 className="w-3 h-3" />
                                    ) : r.Status === "ON_PROGRESS" ? (
                                        <Wrench className="w-3 h-3" />
                                    ) : (
                                        <AlertCircle className="w-3 h-3" />
                                    )}
                                    {r.Status.replace("_", " ")}
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

                                {(r.Status === "PENDING" || r.Status === "ON_PROGRESS") && (
                                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <p className="text-xs font-bold text-slate-700 mb-2">Pemerintah / Admin Area</p>
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) setAdminFile(e.target.files[0]);
                                            }}
                                            className="text-xs w-full mb-2 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-700"
                                        />
                                        <button
                                            onClick={() => adminFile && handleAdminUpdate(r.ID, adminFile)}
                                            disabled={loading || !adminFile}
                                            className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2 rounded-md transition-colors disabled:opacity-50"
                                        >
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
    );
}
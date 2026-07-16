export interface Report {
    ID_Laporan: string | number;
    Nama_Pelapor?: string;
    Deskripsi: string;
    Latitude: number;
    Longitude: number;
    Foto_Lapor: string;
    Status: "PENDING" | "ON_PROGRESS" | "RESOLVED";
    Foto_Perbaikan?: string;
    Dibuat_Pada: string;
    Selesai_Pada?: string;
    Valid_AI?: string | boolean;
    Level_Urgensi?: string;
    Analisis_AI?: string;
}
//tes
export interface Location {
    lat: number;
    lng: number;
}

export interface FormDataState {
    deskripsi: string;
    file: File | null;
}

export interface NominatimResponse {
    lat: string;
    lon: string;
}
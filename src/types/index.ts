export interface Report {
    ID_Laporan: string | number;
    Nama_Pelapor?: string;
    Deskripsi: string;
    Latitude: number;
    Longitude: number;
    Foto_Lapor: string;
    Status: "PENDING" | "RESOLVED";
    Foto_Perbaikan?: string;
    Dibuat_Pada: string;
    Selesai_Pada?: string;
    Valid_AI?: string | boolean;
    Level_Urgensi?: string;
    Analisis_AI?: string;
    Kota_Kabupaten?: string;
    Instansi_Pelaksanaan?: string;
    Telp_Pelapor?: string;
}
//tes
export interface Location {
    lat: number;
    lng: number;
}

export interface FormDataState {
    deskripsi: string;
    file: File | null;
    namaPelapor: string; 
    telpPelapor: string; 
}

export interface NominatimResponse {
    lat: string;
    lon: string;
}
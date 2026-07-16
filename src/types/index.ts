export interface Report {
    ID: string | number;
    Latitude: number;
    Longitude: number;
    Deskripsi: string;
    Status: "PENDING" | "RESOLVED";
    Foto_Lapor: string;
    Foto_Perbaikan?: string;
}

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
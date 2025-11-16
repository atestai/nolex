const baseHost = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const baseUrl = `${baseHost}/api/`;

export async function getClinics() {
    try {
        const response = await fetch(`${baseUrl}clinics`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore durante il fetch:", error);
    }
}

export async function getBodyParts(clinicId: string, query: string, searchBy: string) {
    
    try {
        const search = (query.trim() === '') ? '': `?query=${encodeURIComponent(query)}&searchBy=${encodeURIComponent(searchBy)}`;  
        const response = await fetch(`${baseUrl}clinics/${clinicId}/bodyParts${search}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore durante il fetch:", error);
    }
}

export async function getExamsByBodyPartAndClinic(bodyPartId: string | undefined, clinicId: string | undefined, query: string, searchBy: string) {
    if (!bodyPartId || !clinicId) {
        return;
    }
    try {
        const search = (query.trim() === '') ? '': `&query=${encodeURIComponent(query)}&searchBy=${encodeURIComponent(searchBy)}`;  
        const response = await fetch(`${baseUrl}examsByBodyPartAndClinic?bodyPartId=${bodyPartId}&clinicId=${clinicId}${search}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore durante il fetch:", error);
    }
}   

export async function getClinicsBySearch(query: string, searchBy: string) {
    try {
        const response = await fetch(`${baseUrl}clinics?query=${encodeURIComponent(query)}&searchBy=${encodeURIComponent(searchBy)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore durante il fetch:", error);
    }
    return getClinics();
}

export async function getGeneralInfo() {
    try {
        const response = await fetch(`${baseHost}/info`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore durante il fetch:", error);
    }
}
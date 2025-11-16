import { useMemo, useState } from "react";
import type { SharedStateProviderProps } from "../types/state.types";
import { SharedStateContext } from "../context/StoreContext";
import type { BodyPart, Clinic, Exame } from "../types/fetch.types";
import type { SearchStatus } from "../types/state.types";
import type { DataGridType } from "./DataGrid";
import { SearchBy } from "./SearchBar";

export function SharedStateProvider({ children }: SharedStateProviderProps) {
   
    const [selectedClinic, setSelectedClinic] = useState<string | undefined>(undefined);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | undefined>(undefined);
    const [selectedExame, setSelectedExame] = useState<string | undefined>(undefined);

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [bodyExames, setBodyExames] = useState<Exame[]>([]);

    const [searchStatus, setSearchStatus] = useState<SearchStatus>({ query: '', searchBy: SearchBy.NAME });
  
    const [dataStore, setDataStore] = useState<DataGridType[]>(() => {
        const storedData = sessionStorage.getItem('dataStore');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return [];
    });

    const value = useMemo(() => ({ 
        selectedClinic, setSelectedClinic, 
        selectedBodyPart, setSelectedBodyPart, 
        selectedExame, setSelectedExame, 
        
        clinics, setClinics, 
        bodyParts, setBodyParts, 
        bodyExames, setBodyExames, 
        
        searchStatus, setSearchStatus, 
        dataStore, setDataStore 

    }), [
        selectedClinic, setSelectedClinic, 
        selectedBodyPart, setSelectedBodyPart, 
        selectedExame, setSelectedExame, 
        clinics, setClinics, 
        bodyParts, setBodyParts, 
        bodyExames, setBodyExames, 
        searchStatus, setSearchStatus, 
        dataStore, setDataStore    
    ]);

    return (
        <SharedStateContext.Provider value={value}>
            {children}
        </SharedStateContext.Provider>
    );
}

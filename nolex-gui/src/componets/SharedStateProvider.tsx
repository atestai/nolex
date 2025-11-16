import { use, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { SharedStateProviderProps } from "../types/state.types";
import { SharedStateContext } from "../context/StoreContext";
import type { BodyPart, Clinic, Exame } from "../types/fetch.types";
import { SearchBy, type SearchByType } from "./SearchBar";
import type { DataGridType } from "./DataGrid";

export function SharedStateProvider({ children }: SharedStateProviderProps) {
   
    const [selectedClinic, setSelectedClinic] = useState<string | undefined>(undefined);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | undefined>(undefined);
    const [selectedExame, setSelectedExame] = useState<string | undefined>(undefined);

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [bodyExames, setBodyExames] = useState<Exame[]>([]);

    
    //const [query, setQuery] = useState('');
    // const [query, setQuery] = useState('');
    // const [searchBy, setSearchBy] = useState<SearchByType>(SearchBy.NAME);

    const [dataStore, setDataStore] = useState<DataGridType[]>(() => {
        const storedData = sessionStorage.getItem('dataStore');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return [];
    });

    const value = useMemo(() => ({ selectedClinic, setSelectedClinic, selectedBodyPart, setSelectedBodyPart, selectedExame, setSelectedExame, clinics, setClinics, bodyParts, setBodyParts, bodyExames, setBodyExames, query, setQuery, searchBy, setSearchBy, dataStore, setDataStore 
    }), [selectedClinic, setSelectedClinic, selectedBodyPart, setSelectedBodyPart, selectedExame, setSelectedExame, clinics, setClinics, bodyParts, setBodyParts, bodyExames, setBodyExames, query, setQuery, searchBy, setSearchBy, dataStore, setDataStore    ]);

    return (
        <SharedStateContext.Provider value={value}>
            {children}
        </SharedStateContext.Provider>
    );
}

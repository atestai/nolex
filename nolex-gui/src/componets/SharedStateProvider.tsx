import { useMemo, useState } from "react";
import type { SharedStateProviderProps } from "../types/state.types";
import { SharedStateContext } from "../context/StoreContext";
import type { BodyPart, Clinic, Exame } from "../types/fetch.types";

export function SharedStateProvider({ children }: SharedStateProviderProps) {
   
    const [selectedClinic, setSelectedClinic] = useState<string | undefined>(undefined);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | undefined>(undefined);
    const [selectedExame, setSelectedExame] = useState<string | undefined>(undefined);

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [bodyExames, setBodyExames] = useState<Exame[]>([]);

    const value = useMemo(() => ({ selectedClinic, setSelectedClinic, selectedBodyPart, setSelectedBodyPart, selectedExame, setSelectedExame, clinics, setClinics, bodyParts, setBodyParts, bodyExames, setBodyExames 
    }), [selectedClinic, setSelectedClinic, selectedBodyPart, setSelectedBodyPart, selectedExame, setSelectedExame, clinics, setClinics, bodyParts, setBodyParts, bodyExames, setBodyExames]);

    return (
        <SharedStateContext.Provider value={value}>
            {children}
        </SharedStateContext.Provider>
    );
}

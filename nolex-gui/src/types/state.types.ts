import type { ReactNode } from "react";
import type { BodyPart, Clinic, Exame } from "./fetch.types";
import type { SearchByType } from "../componets/SearchBar";
import type { DataGridType } from "../componets/DataGrid";

export interface SharedState {
    query: string;
    setQuery: (query: string) => void;

    searchBy: SearchByType;
    setSearchBy: (searchBy: SearchByType) => void;

    selectedClinic: string | undefined;
    setSelectedClinic: (clinicId: string | undefined) => void;
    selectedBodyPart: string | undefined;
    setSelectedBodyPart: (bodyPartId: string | undefined) => void;
    selectedExame: string | undefined;
    setSelectedExame: (exameId: string | undefined) => void;

    clinics: Clinic[];
    setClinics: (clinics: Clinic[]) => void;
    bodyParts: BodyPart[];
    setBodyParts: (bodyParts: BodyPart[]) => void;
    bodyExames: Exame[];
    setBodyExames: (exames: Exame[]) => void;

    dataStore: DataGridType[];
    setDataStore: (dataStore: DataGridType[] | ((prevData: DataGridType[]) => DataGridType[])) => void;
}

export interface SharedStateProviderProps {
  children: ReactNode;
}

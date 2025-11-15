import type { ReactNode } from "react";
import type { BodyPart, Clinic, Exame } from "./fetch.types";

export interface SharedState {
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
}

export interface SharedStateProviderProps {
  children: ReactNode;
}

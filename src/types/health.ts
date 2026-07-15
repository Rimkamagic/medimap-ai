export type Urgency = "EMERGENCY" | "URGENT" | "ROUTINE" | "SELF_CARE";

export type AgeGroup = "infant" | "teen" | "adult" | "middle" | "senior";
export type Gender = "male" | "female" | "other";

export interface SymptomInput {
  symptoms: string;
  affectedArea: string;
  onset: string;
  painLevel: number;
  fever: boolean;
  trauma: boolean;
  ageGroup: AgeGroup;
  gender: Gender;
  pregnant: boolean;
  allergies?: string;
  conditions?: string;
  medications?: string;
  extraDescription?: string;
  healthConsent: boolean;
  saveHistory: boolean;
}

export interface PossibleCause {
  name: string;
  reason: string;
}

export interface RecommendedDepartment {
  name: string;
  reason: string;
}

export interface AnalysisResult {
  urgency: Urgency;
  summary: string;
  possibleCauses: PossibleCause[];
  recommendedDepartments: RecommendedDepartment[];
  selfCare: string[];
  warningSigns: string[];
  medicineSearchKeywords: string[];
  emergencyMatchedSignals?: string[];
}

export interface Medicine {
  itemSeq: string;
  itemName: string;
  companyName: string;
  classification: string;
  ingredients: string[];
  efficacy: string;
  usage: string;
  precautions: string;
  interactions: string;
  sideEffects: string;
  storage: string;
  sourceUrl: string;
}

export interface MedicalPlace {
  id: string;
  type: "hospital" | "pharmacy" | "emergency";
  name: string;
  departments?: string[];
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  openingHours?: string;
  distance?: number;
}

export interface SearchHistoryItem {
  id: string;
  createdAt: string;
  summary: string;
  urgency: Urgency;
  departments: string[];
}

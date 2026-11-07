export type EvidenceLevel =
  | "primary-research"
  | "official-regulatory"
  | "patent"
  | "manufacturer-data"
  | "secondary-source"
  | "unverified";

export type ValidationStatus =
  | "discovery"
  | "hypothesis"
  | "bench-tested"
  | "pilot-tested"
  | "commercially-validated"
  | "rejected";

export type ResearchSource = {
  title: string;
  url: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt: string;
  evidenceLevel: EvidenceLevel;
};

export type ResearchFinding = {
  id: string;
  title: string;
  summary: string;
  mechanism?: string;
  productApplication?: string;
  validationStatus: ValidationStatus;
  confidence: "low" | "medium" | "high";
  sources: ResearchSource[];
  limitations: string[];
  nextExperiment?: string;
};
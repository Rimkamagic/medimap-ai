import { emergencySignals } from "@/config/emergencySignals";
import type { SymptomInput } from "@/types/health";

export function findEmergencySignals(input: Pick<SymptomInput, "symptoms" | "extraDescription" | "painLevel">): string[] {
  const text = `${input.symptoms} ${input.extraDescription ?? ""}`.toLowerCase();
  const matched = emergencySignals
    .filter((signal) => signal.patterns.some((pattern) => text.includes(pattern.toLowerCase())))
    .map((signal) => signal.label);

  if (input.painLevel >= 9 && /가슴|흉부|심장|호흡|숨/.test(text) && !matched.includes("심한 흉통")) {
    matched.push("심한 흉통");
  }

  return [...new Set(matched)];
}

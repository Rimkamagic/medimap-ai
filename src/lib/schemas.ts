import { z } from "zod";

export const symptomSchema = z.object({
  symptoms: z.string().trim().min(5, "증상을 5자 이상 입력해 주세요."),
  affectedArea: z.string().min(1, "아픈 부위를 선택해 주세요."),
  onset: z.string().min(1, "증상 시작 시점을 선택해 주세요."),
  painLevel: z.number().min(0).max(10),
  fever: z.boolean(),
  trauma: z.boolean(),
  ageGroup: z.enum(["infant", "teen", "adult", "middle", "senior"], {
    error: "나이대를 선택해 주세요."
  }),
  gender: z.enum(["male", "female", "other"], {
    error: "성별을 선택해 주세요."
  }),
  pregnant: z.boolean(),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
  extraDescription: z.string().optional(),
  healthConsent: z.boolean().refine((value) => value, "건강정보 수집 및 이용에 동의해 주세요."),
  saveHistory: z.boolean()
});

export type SymptomFormValues = z.infer<typeof symptomSchema>;

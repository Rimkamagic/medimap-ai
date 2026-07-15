import { NextResponse } from "next/server";
import { buildMockAnalysis } from "@/lib/analysis";
import { symptomSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = symptomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력값을 다시 확인해 주세요.",
          issues: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const result = buildMockAnalysis(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}

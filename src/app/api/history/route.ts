import { NextRequest, NextResponse } from "next/server";
import { listSupabaseHistory, saveSupabaseHistory, deleteSupabaseHistory, clearSupabaseHistory } from "@/lib/storage/historyRepository";
import { buildMockAnalysis } from "@/lib/analysis";
import { symptomSchema } from "@/lib/schemas";
import type { AnalysisResult } from "@/types/health";

function getDeviceId(request: NextRequest) {
  return request.headers.get("x-medimap-device-id")?.trim() ?? "";
}

function isValidDeviceId(deviceId: string) {
  return /^[0-9a-f-]{36}$/i.test(deviceId);
}

export async function GET(request: NextRequest) {
  const deviceId = getDeviceId(request);
  if (!isValidDeviceId(deviceId)) {
    return NextResponse.json({ history: [] });
  }

  try {
    const history = await listSupabaseHistory(deviceId);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: "저장된 기록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const deviceId = getDeviceId(request);
  if (!isValidDeviceId(deviceId)) {
    return NextResponse.json({ error: "저장 식별자가 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { symptomInput?: unknown; analysisResult?: AnalysisResult };
    const parsed = symptomSchema.safeParse(body.symptomInput);

    if (!parsed.success) {
      return NextResponse.json({ error: "저장할 입력값을 확인해 주세요." }, { status: 400 });
    }

    if (!parsed.data.saveHistory) {
      return NextResponse.json({ stored: false });
    }

    const analysisResult = body.analysisResult ?? buildMockAnalysis(parsed.data);
    const item = await saveSupabaseHistory({
      deviceId,
      symptomInput: parsed.data,
      analysisResult
    });

    return NextResponse.json({ stored: Boolean(item), item });
  } catch {
    return NextResponse.json({ error: "기록 저장 중 문제가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const deviceId = getDeviceId(request);
  if (!isValidDeviceId(deviceId)) {
    return NextResponse.json({ error: "저장 식별자가 올바르지 않습니다." }, { status: 400 });
  }

  const id = request.nextUrl.searchParams.get("id");

  try {
    if (id === "all") {
      await clearSupabaseHistory(deviceId);
    } else if (id) {
      await deleteSupabaseHistory(deviceId, id);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "기록 삭제 중 문제가 발생했습니다." }, { status: 500 });
  }
}

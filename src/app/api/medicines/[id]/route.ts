import { NextRequest, NextResponse } from "next/server";
import { getMedicineById } from "@/lib/api/mfds";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const medicine = await getMedicineById(id);

  if (!medicine) {
    return NextResponse.json({ error: "의약품 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ medicine });
}

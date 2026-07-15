import { NextRequest, NextResponse } from "next/server";
import { searchMedicines } from "@/lib/api/mfds";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const medicines = await searchMedicines({ query });
  return NextResponse.json({ medicines });
}

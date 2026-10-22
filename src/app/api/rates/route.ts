import { NextResponse } from "next/server";
import { getCbarRates } from "@/lib/cbar";

export async function GET() {
  try {
    const bulletin = await getCbarRates();
    return NextResponse.json(bulletin, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "rates_unavailable" }, { status: 502 });
  }
}

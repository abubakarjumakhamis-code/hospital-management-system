import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Place {
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  boundingBox?: [number, number, number, number];
}

interface NominatimItem {
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
  class?: string;
  boundingbox?: string[];
}

/**
 * Proxy ya utafutaji wa mahali kwa OpenStreetMap Nominatim. Inatumika na
 * sehemu ya "Search a place" kwenye ramani. Nominatim inahitaji User-Agent
 * halali, hivyo tunafanya ombi upande wa server.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const near = searchParams.get("near");

  if (q.length < 2) {
    return NextResponse.json({ places: [] });
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    limit: "6",
    addressdetails: "1",
  });

  if (near) {
    const [lat, lng] = near.split(",").map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      params.set("viewbox", `${lng - 0.4},${lat + 0.4},${lng + 0.4},${lat - 0.4}`);
      params.set("bounded", "0");
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent":
            "NorthstarHealthHMS/1.0 (hospital management system; contact@northstar.health)",
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ places: [] }, { status: 200 });
    }

    const data = await res.json();
    const places: Place[] = (Array.isArray(data) ? (data as NominatimItem[]) : [])
      .map((item) => ({
        displayName: String(item.display_name ?? ""),
        lat: Number(item.lat),
        lng: Number(item.lon),
        type: String(item.type ?? item.class ?? ""),
        boundingBox: Array.isArray(item.boundingbox)
          ? [
              Number(item.boundingbox[0]),
              Number(item.boundingbox[1]),
              Number(item.boundingbox[2]),
              Number(item.boundingbox[3]),
            ] as [number, number, number, number]
          : undefined,
      }))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: [] }, { status: 200 });
  }
}

import { NextResponse } from "next/server";
import { getData, updateSettings } from "@/lib/kv";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    return NextResponse.json(await getData());
  } catch (e) {
    console.error("GET /api/data", e);
    return NextResponse.json(
      { error: "Error al cargar la configuración." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Configuración inválida", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const updated = await updateSettings(parsed.data);
    return NextResponse.json(updated);
  } catch (e) {
    console.error("POST /api/data", e);
    return NextResponse.json(
      { error: "Error al guardar la configuración." },
      { status: 500 }
    );
  }
}

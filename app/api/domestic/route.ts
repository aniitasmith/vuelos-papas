import { NextResponse } from "next/server";
import { upsertDomestic, deleteDomestic } from "@/lib/kv";
import { domesticSchema } from "@/lib/validations";
import { Domestic } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = domesticSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de trayecto nacional inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d: Domestic = parsed.data;
    return NextResponse.json(await upsertDomestic(d));
  } catch (e) {
    console.error("POST /api/domestic", e);
    return NextResponse.json(
      { error: "Error al guardar el trayecto nacional." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) {
      return NextResponse.json({ error: "Falta el id del trayecto nacional" }, { status: 400 });
    }
    return NextResponse.json(await deleteDomestic(id));
  } catch (e) {
    console.error("DELETE /api/domestic", e);
    return NextResponse.json(
      { error: "Error al eliminar el trayecto nacional." },
      { status: 500 }
    );
  }
}

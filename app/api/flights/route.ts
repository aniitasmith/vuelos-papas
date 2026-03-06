import { NextResponse } from "next/server";
import { upsertRoute, deleteRoute } from "@/lib/kv";
import { routeSchema } from "@/lib/validations";
import { Route } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = routeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de ruta inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const route: Route = { ...parsed.data, domesticId: parsed.data.domesticId };
    return NextResponse.json(await upsertRoute(route));
  } catch (e) {
    console.error("POST /api/flights", e);
    return NextResponse.json(
      { error: "Error al guardar la ruta. Revisá la consola del servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) {
      return NextResponse.json({ error: "Falta el id de la ruta" }, { status: 400 });
    }
    return NextResponse.json(await deleteRoute(id));
  } catch (e) {
    console.error("DELETE /api/flights", e);
    return NextResponse.json(
      { error: "Error al eliminar la ruta." },
      { status: 500 }
    );
  }
}

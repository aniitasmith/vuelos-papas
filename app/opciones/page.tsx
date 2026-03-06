import { getData } from "@/lib/kv";
import FlightApp from "@/components/FlightApp";

export const dynamic = "force-dynamic";

export default async function OpcionesPage() {
  const initialData = await getData();
  return <FlightApp initialData={initialData} />;
}

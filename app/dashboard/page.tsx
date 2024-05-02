import {
  getData,
  getDoneData,
  getNotDoneData,
} from "@/api/fetch/getDataTableData";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientToDoTable } from "@/components/table/client-todo-table";

export default async function Page() {
  // Koble til SupaBase
  const supabase = createClient();

  // Sjekke om bruker er logget inn og redirecte til login om ikke
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  // Fetch data fra supabase og returner i data
  const data = await getData();
  const doneData = await getDoneData();
  const notDoneData = await getNotDoneData();

  return (
    <div className="flex w-full">
      <ClientToDoTable data={data} />
    </div>
  );
}

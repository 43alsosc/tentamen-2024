import {
  getData,
  getDoneData,
  getNotDoneData,
} from "@/api/fetch/getDataTableData";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientToDoTable } from "@/components/table/client-todo-table";
import Profile from "@/components/Profile";

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
    <div className="flex flex-wrap w-full">
      <div className="flex bg-gray-400 w-full justify-between mb-6">
        <h1 className="text-3xl text-left px-8 py-2">Dashboard</h1>
        <Profile />
      </div>
      <ClientToDoTable data={data} />
    </div>
  );
}

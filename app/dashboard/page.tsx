import getData from "@/api/fetch/getDataTableData";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // Koble til SupaBase
  const supabase = createClient();

  // Sjekke om bruker er logget inn og redirecte til login om ikke
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch data fra supabase og returner i data
  const data = await getData();

  return (
    <div className="flex">
      <div className="bg-gray-300"></div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

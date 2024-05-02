import { ToDo } from "@/components/data-table/columns";
import { createClient } from "@/utils/supabase/server";

export async function getData(): Promise<ToDo[]> {
  const supabase = createClient();
  supabase.auth.getUser();

  const { data, error } = await supabase.from("todos").select("*");
  if (error) {
    console.error("Error fetching todos");
    throw error;
  } else if (!data) {
    console.error("No data found");
  }
  return data;
}

export async function getDoneData(): Promise<ToDo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .match({ is_complete: true });
  if (error) {
    console.error("Error fetching todos");
    throw error;
  } else if (!data) {
    console.error("No data found");
  }
  return data;
}

export async function getNotDoneData(): Promise<ToDo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .match({ is_complete: false });
  if (error) {
    console.error("Error fetching todos");
    throw error;
  } else if (!data) {
    console.error("No data found");
  }
  return data;
}

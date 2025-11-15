import { Person } from "@/components/types/person";
import { api } from "@/components/utils/api";

export async function get_all_persons() {
  const { data } = await api.get("/persons");
  return data as Person[];
}

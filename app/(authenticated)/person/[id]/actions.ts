import { PersonDetails } from "@/components/types/person";
import { api } from "@/components/utils/api";

export async function get_person_details(id: string) {
  const { data } = await api.get(`/persons/${id}`);
  return data as PersonDetails;
}

export async function update_person_name(id: string, name: string) {
  await api.put(`/persons/${id}`, { name });
}

export async function delete_person(id: string) {
  await api.delete(`/persons/${id}`);
}

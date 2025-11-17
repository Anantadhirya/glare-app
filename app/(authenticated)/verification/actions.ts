import { Face } from "@/components/types/face";
import { api } from "@/components/utils/api";

export async function get_unverified_faces() {
  const { data } = await api.get("/faces/unverified/all");
  return data as Face[];
}

export async function update_person_name(id: string, name: string) {
  await api.put(`/persons/${id}`, { name });
}

export async function update_face(
  id: string,
  verified: boolean,
  person_id: string
) {
  await api.put(`/faces/${id}`, { person_id, verified });
}

export async function delete_all_unverified_faces() {
  await api.delete("/faces/unverified/all");
}

export async function delete_face(id: string) {
  await api.delete(`/faces/${id}`);
}

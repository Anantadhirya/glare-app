import { Face } from "@/components/types/face";
import { api } from "@/components/utils/api";

export async function get_face_details(id: string) {
  const { data } = await api.get(`/faces/${id}`);
  return data as Face;
}

export async function update_face(
  id: string,
  verified: boolean,
  person_id: string
) {
  await api.put(`/faces/${id}`, { person_id, verified });
}

export async function delete_face(id: string) {
  await api.delete(`/faces/${id}`);
}

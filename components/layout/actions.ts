import { PersonSimple } from "../types/person";
import { api } from "../utils/api";

export async function add_new_face(person_id: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/faces?person_id=${person_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data as { id: string };
}

export async function get_simple_person_list() {
  const { data } = await api.get("/persons/simple");
  return data as PersonSimple[];
}

export async function create_new_person(name: string) {
  const { data } = await api.post(`/persons`, { name });
  return data as PersonSimple;
}

export async function get_unverified_count() {
  const { data } = await api.get("/faces/unverified/count");
  return data.count as number;
}

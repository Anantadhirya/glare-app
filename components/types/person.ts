import { Face } from "./face";

export type Person = {
  id: string;
  name: string;
  sample_image_url: string;
  face_count: number;
};

export type PersonSimple = {
  id: string;
  name: string;
};

export type PersonDetails = {
  id: string;
  name: string;
  created_at: string;
  faces: Omit<Face, "person_id" | "person_name">[];
};

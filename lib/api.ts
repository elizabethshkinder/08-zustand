import axios from "axios";
import type { Note } from "../types/note";
import type { NoteFormValues } from "../components/NoteForm/NoteForm";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search) {
    params.search = search;
  }

  if (tag) {
    params.tag = tag;
  }

  const { data } = await noteApi.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NoteFormValues): Promise<Note> {
  const { data } = await noteApi.post<Note>('/notes', newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
}
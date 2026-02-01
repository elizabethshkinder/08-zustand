import css from "./NoteList.module.css";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote } from "@/lib/api";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

             <Link className={css.link} href={`/notes/${id}`}>
                View details
              </Link>

            <button
              type="button"
              className={css.button}
              disabled={deletingId === id}
              onClick={() => deleteNoteMutation.mutate(id)}
            >
              {deletingId === id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

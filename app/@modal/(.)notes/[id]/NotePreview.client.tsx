"use client";

import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  noteId: string;
};

export default function NotePreviewClient({ noteId: id }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  function closeModal(): void {
    router.back();
  }

  if (isLoading) return <>Loading...</>;
  if (isError || !note) return <>Something went wrong. Please try again...</>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
          <p className={css.tag}>{note.tag}</p>

          <button className={css.backBtn} type="button" onClick={closeModal}>
            Go back
          </button>
        </div>
      </div>
    </Modal>
  );
}

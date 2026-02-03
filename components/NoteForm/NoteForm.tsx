"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import type { NoteFormValues } from "@/types/note";


export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
      
      clearDraft();
      router.back();
    },

    onError: () => {
      alert("Failed to create note. Please try again.");
    },
  });

 function handleInputChange(
  event: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  const { name, value } = event.target;

  if (name === "title") {
    setDraft({ title: value });
    return;
  }

  if (name === "content") {
    setDraft({ content: value });
    return;
  }

  if (name === "tag") {
    setDraft({ tag: value as NoteTag });
    return;
  }
}

  function handleClickCancelBtn() {
    router.back(); 
  }

  function handleSubmit(formData: FormData): void {
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;

    const values: NoteFormValues = { title, content, tag };
    createNoteMutation.mutate(values);
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleInputChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleInputChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleInputChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          disabled={createNoteMutation.isPending}
          onClick={handleClickCancelBtn}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}

"use client";

import css from "./NotesPage.module.css";

type ErrorProps = {
  error: Error;
};

export default function Error({ error }: ErrorProps) {
  return (
    <div className={css.container}>
      <p className={css.content}>
        Could not fetch the list of notes. {error.message}
      </p>
    </div>
  );
}
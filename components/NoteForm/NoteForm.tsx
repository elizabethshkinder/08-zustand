import css from "./NoteForm.module.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { createNote } from '@/lib/api';
import type { NoteTag } from '../../types/note';

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  readonly onCloseModal: () => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be between 3 and 50 characters")
    .max(50, "Title must be between 3 and 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content can contain up to 500 characters"),
  tag: Yup.string()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const queryClient = useQueryClient();

   const createNoteMutation = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCloseModal();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={(values: NoteFormValues) => createNoteMutation.mutate(values)}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="p" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="p" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="p" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCloseModal}
            disabled={createNoteMutation.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
"use client";

import css from "./NotesPage.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

import Link from "next/link";

type NotesClientProps = {
    tag?: string;
    page: number;
    query: string;
};

export default function NotesClient({ tag, page, query }: NotesClientProps) {

  const [currentPage, setCurrentPage] = useState<number>(tag ? 1 : page);
  const [currentQuery, setCurrentQuery] = useState<string>(tag ? "" : query);


  const { data } = useQuery({
    queryKey: ["notes", currentPage, currentQuery, tag ?? undefined],
    queryFn: () => fetchNotes(currentPage, currentQuery, tag ?? undefined),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleChangeQuery = useDebouncedCallback(
    (value: string) => {
      setCurrentPage(1);
      setCurrentQuery(value.trim());
    },
    100
  );

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChangeQuery} value={currentQuery} />

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
        Create note +
        </Link>

      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

    </div>
  );
}

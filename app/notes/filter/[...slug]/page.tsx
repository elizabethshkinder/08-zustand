import { fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type NotesByCategoryProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: {
    page?: string;
    query?: string;
  };
};

export default async function NotesByCategory({ params, searchParams }: NotesByCategoryProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const tag = slug?.[0] === "all" ? undefined : slug?.[0];
  const pageNumber = Number(sp.page) || 1;
  const query = sp.query ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", pageNumber, query, tag ?? undefined],
    queryFn: () => fetchNotes(pageNumber, query, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} page={pageNumber} query={query} />
    </HydrationBoundary>
  );
}


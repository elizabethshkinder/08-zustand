import { fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type NotesByCategoryProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: {
    page?: string;
    query?: string;
  };
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: NotesByCategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "All" : slug[0];

  return {
    title: `${tag} notes`,
    description: `All notes categorized as ${tag}`,
    openGraph: {
      title: `${tag} notes`,
      description: `All notes categorized as ${tag}`,
      url: `${APP_URL}/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag} notes`,
        },
      ],
    },
  };
}

export default async function NotesByCategory({ params, searchParams }: NotesByCategoryProps) {
  const { slug } = await params;
  const sp = searchParams;

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


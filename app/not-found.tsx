import { Metadata } from "next";
import css from "./Home.module.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "Sorry, the page you are looking for does not exist.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "Sorry, the page you are looking for does not exist.",
    url: `${APP_URL}/404`,
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Page not found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}

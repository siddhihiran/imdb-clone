import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ThemeProvider, Theme } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "MovieDB - Discover Movies & TV Shows",
  description: "Explore trending movies, top-rated cinema, actors, trailers, and reviews on MovieDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme stored in cookie for SSR flash-free rendering
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme: Theme =
    themeCookie === "light" || themeCookie === "high-contrast" || themeCookie === "auto"
      ? (themeCookie as Theme)
      : "dark";

  return (
    <html
      lang="en"
      data-theme={initialTheme === "auto" ? "dark" : initialTheme}
      className={initialTheme === "light" ? "light" : "dark"}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased selection:bg-yellow-500 selection:text-black">
        <ThemeProvider initialTheme={initialTheme}>
          <QueryProvider>
            <Navbar />
            <ErrorBoundary>
              <div className="min-h-[calc(100vh-4rem)]">{children}</div>
            </ErrorBoundary>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

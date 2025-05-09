// src/app/layout.tsx

import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

export const metadata: Metadata = {
  title: {
    template: "%s | Roommate",
    default: "Roommate",
  },
  description: "Next.js dashboard kit.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (!("theme" in localStorage)) {
              document.documentElement.classList.add("dark");
            } else if (localStorage.theme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          `,
        }}
      />
    </head>
    <body className="min-h-screen bg-gray-2 dark:bg-dark">
      <SessionProvider session={session}>
        <Providers>
          <NextTopLoader showSpinner={false} />
          {children}
        </Providers>
      </SessionProvider>
    </body>
  </html>
  
  );
}

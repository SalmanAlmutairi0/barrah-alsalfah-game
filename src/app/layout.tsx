import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "برا السالفة اونلاين ",
  description:
    "برا السالفة - لعبة جماعية ممتعة مع أصحابك، اكتشف مين اللي برا السالفة من بينكم!",
  keywords: [
    "برا السالفة اونلاين",
    "برا السالفة",
    "لعبة جماعية",
    "العاب اصحاب",
    "العاب حفلات",
    "كلمات سرية",
    "العاب اونلاين",
    "العاب عربية",
  ],
  openGraph: {
    title: "برا السالفة | لعبة جماعية",
    description:
      "عيش جو التحدي مع أصحابك في برا السالفة واكتشف مين اللي مو معكم في السالفة!",
    type: "website",
    locale: "ar_SA",
    // url: "https://bara-alsalfa.com",
    siteName: "برا السالفة",
  },
  twitter: {
    card: "summary_large_image",
    title: "برا السالفة | لعبة جماعية",
    description:
      "برا السالفة - لعبة جماعية ممتعة مع أصحابك، اكتشف مين اللي برا السالفة!",
    creator: "@bara_alsalfa",
  },
  // metadataBase: new URL("https://bara-alsalfa.com")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl" data-scroll-behavior="smooth">
      <body
        className={`${ibmPlexSansArabic.className} bg-gradient-to-br from-background via-card to-muted min-h-screen `}
      >
        {children}
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}

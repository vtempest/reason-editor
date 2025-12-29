import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/editor/theme-provider"
import { Toaster } from "sonner"
import "../index.css"
import "../components/editor/themes-shadcn.css"

// Font CSS variables are defined in globals.css with system font fallbacks
// This avoids Google Fonts download issues during build

export const metadata: Metadata = {
  title: "Reason - Research Manager",
  description:
    "A powerful research manager with nested documents, rich-text editing, and full-text search",
  authors: [{ name: "Reason" }],
  openGraph: {
    title: "Reason - Research Manager",
    description:
      "A powerful research manager with nested documents, rich-text editing, and full-text search",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Reason",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const theme = cookieStore.get("color-theme")?.value || "modern-minimal"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased theme-${theme}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}

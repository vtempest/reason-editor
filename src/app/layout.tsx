import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Playfair_Display,
  Merriweather,
  Lora,
  Source_Code_Pro,
  Fira_Code,
  Nunito,
  Raleway,
  Ubuntu,
  Oswald,
  PT_Serif,
  Inconsolata
} from "next/font/google"
import { ThemeProvider } from "@/components/editor/theme-provider"
import { Toaster } from "sonner"
import "../index.css"
import "../components/editor/themes-shadcn.css"

// Configure Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap"
})
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap"
})
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap"
})
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
})
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap"
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap"
})
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap"
})
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap"
})
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap"
})
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
})
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap"
})
const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap"
})
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap"
})
const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: "swap"
})
const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap"
})

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
      <body className={`font-sans antialiased theme-${theme} ${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${playfair.variable} ${merriweather.variable} ${lora.variable} ${sourceCodePro.variable} ${firaCode.variable} ${nunito.variable} ${raleway.variable} ${ubuntu.variable} ${oswald.variable} ${ptSerif.variable} ${inconsolata.variable}`}>
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

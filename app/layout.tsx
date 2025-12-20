import type { Metadata } from 'next'
import '@/src/index.css'

export const metadata: Metadata = {
  title: 'Reason - Powerful Note-Taking App',
  description: 'A powerful note-taking app with nested documents, rich-text editing, and full-text search',
  authors: [{ name: 'Reason' }],
  openGraph: {
    title: 'Reason - Powerful Note-Taking App',
    description: 'A powerful note-taking app with nested documents, rich-text editing, and full-text search',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Lovable',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

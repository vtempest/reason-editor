import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reason Editor',
  description: 'Reason-based writing and research editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

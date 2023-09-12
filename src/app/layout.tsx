import './globals.css'

export const metadata = {
  title: 'upload.ai',
  description: 'upload.ai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}

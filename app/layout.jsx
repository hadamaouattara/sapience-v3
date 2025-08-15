import './globals.css'

export const metadata = {
  title: 'SAPience ML Platform v3.0',
  description: 'Transform Your SAP with AI-Powered Analytics & PUP Prediction',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  title: "Yisa - Sistema de Transferências Escolares",
  description: "Sistema de emissão e verificação de documentos escolares com código QR para Moçambique",
  applicationName: "Yisa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yisa",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon/40.png",
    apple: [
      { url: "/icon/144.png" },
      { url: "/icon/256.png", sizes: "256x256", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Yisa" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('[App] Service Worker registrado com sucesso:', registration.scope);
                  })
                  .catch((error) => {
                    console.log('[App] Falha ao registrar Service Worker:', error);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  )
}

import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "@/redux/Provider";
import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find My Rentals",
  description: "Find Your Desired Rentals",
  icons: '/icons/logo2.svg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <Providers>
            <AuthProvider>
              <ProtectedRoute>
                {children}
                <Toaster />
              </ProtectedRoute>
            </AuthProvider>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

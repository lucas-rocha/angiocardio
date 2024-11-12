
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Selecione os pesos que você quer usar
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/store";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Workflow Engine",
  description: "Business workflow management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}

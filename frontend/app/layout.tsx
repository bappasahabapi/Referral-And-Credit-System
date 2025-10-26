import Providers from "../store/Providers";
import Navbar from "../components/Navbar";
import { ToastProvider } from "../components/ToastProvider";
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "FileSure Referral",
  description: "Referral & Credit System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            <div className="min-h-screen">
              <header className="border-b border-slate-800/80 sticky top-0 z-10 bg-slate-950/60 backdrop-blur">
                <Navbar />
              </header>
              <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
            </div>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

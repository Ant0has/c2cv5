'use client'
import { Footer, Header } from "@/widgets";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import TelegramBar from "@/shared/components/TelegramBar/TelegramBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <>
    <div className="app-layout">
      <TelegramBar />
      <Header />
      <main className={clsx("app-main", {'bg-dark': pathname === '/dlya-biznesa', 'bg-white': pathname !== '/dlya-biznesa'})}>
        {children}
      </main>
      <Footer />
    </div>
  </>;
}

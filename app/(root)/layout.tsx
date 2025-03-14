'use-client'

import Footer from "@/shared/components/Footer/Footer";
import Header from "../../shared/components/Header/Header";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    <div className="app-layout">
      <Header />
      <main className="app-main">
        {children}
      </main>
      <Footer />
    </div>
  </>;
}
import Footer from "@/shared/components/Footer/Footer";
import Header from "../../shared/components/Header/Header";
import QuestionModal from "@/shared/components/modals/QuestionModal/QuestionModal";


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
        <QuestionModal />
      </main>
      <Footer />

    </div>
  </>;
}
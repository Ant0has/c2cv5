// app/components/ModalsWrapper.tsx
'use client'

import OrderModal from "@/shared/components/modals/OrderModal/OrderModal";
import QuestionModal from "@/shared/components/modals/QuestionModal/QuestionModal";

export default function ModalsWrapper() {
  return (
    <>
      <QuestionModal />
      <OrderModal />
    </>
  );
}
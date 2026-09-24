"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { loadFaqFeedback, saveFaqFeedback, type FaqFeedbackVote } from "@/lib/support/faq-feedback";

export function FaqFeedback({ questionId, onOpenCase }: { questionId: string; onOpenCase: () => void }) {
  const t = useTranslations("Faq.feedback");
  const [vote, setVote] = useState<FaqFeedbackVote | null | undefined>(undefined);

  useEffect(() => {
    setVote(loadFaqFeedback(questionId));
  }, [questionId]);

  function handleVote(next: FaqFeedbackVote) {
    saveFaqFeedback(questionId, next);
    setVote(next);
  }

  if (vote === undefined) {
    return <div className="mt-5 min-h-16" />;
  }

  if (vote) {
    return (
      <div className="mt-5">
        <p className="text-[14px] leading-6 text-[#3C444B]">{t("thanks")}</p>
        {vote === "no" ? (
          <button
            type="button"
            onClick={onOpenCase}
            className="mt-2 text-left text-[14px] font-semibold text-[#E1251B] hover:text-[#E1111C]"
          >
            {t("stillNeedHelp")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="text-[14px] leading-6 text-[#5C656C]">{t("prompt")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleVote("yes")}
          className="inline-flex h-11 min-w-20 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-4 text-[14px] font-semibold text-[#141F25] transition-colors hover:border-[#141F25]"
        >
          {t("yes")}
        </button>
        <button
          type="button"
          onClick={() => handleVote("no")}
          className="inline-flex h-11 min-w-20 items-center justify-center rounded-full border border-[#D5DAE0] bg-white px-4 text-[14px] font-semibold text-[#141F25] transition-colors hover:border-[#141F25]"
        >
          {t("no")}
        </button>
      </div>
    </div>
  );
}

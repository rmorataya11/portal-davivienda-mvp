export type FaqFeedbackVote = "yes" | "no";

function storageKey(questionId: string) {
  return `faq-feedback:${questionId}`;
}

export function loadFaqFeedback(questionId: string): FaqFeedbackVote | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(questionId));
    return raw === "yes" || raw === "no" ? raw : null;
  } catch {
    return null;
  }
}

export function saveFaqFeedback(questionId: string, vote: FaqFeedbackVote) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(questionId), vote);
}

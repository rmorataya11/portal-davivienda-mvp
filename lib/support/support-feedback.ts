export type SupportFeedbackVote = "yes" | "no";

function storageKey(questionId: string) {
  return `support-feedback:${questionId}`;
}

export function loadSupportFeedback(questionId: string): SupportFeedbackVote | null {
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

export function saveSupportFeedback(questionId: string, vote: SupportFeedbackVote) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(questionId), vote);
}

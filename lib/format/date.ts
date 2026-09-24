const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCalendarDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const dateOnly = DATE_ONLY.exec(trimmed);
  if (dateOnly) {
    const date = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCalendarDate(value: string, locale?: string) {
  const date = parseCalendarDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es", { dateStyle: "medium" }).format(date);
}

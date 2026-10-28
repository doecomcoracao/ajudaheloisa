const UTM_PARAMETERS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
];

export function t() {
  if (typeof window === "undefined") {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    UTM_PARAMETERS.flatMap((parameter) => {
      const value = searchParams.get(parameter);
      return value ? [[parameter, value]] : [];
    }),
  );
}

const FIELD_NAMES = [
  "registration_access_token",
  "token_endpoint_auth_method",
  "software_statement",
  "invalid_token",
  "software_id",
  "token_type_hint",
  "tls_client_auth",
  "private_key_jwt",
  "redirect_uris",
  "access_token",
  "refresh_token",
  "client_secret",
  "expires_in",
  "grant_type",
  "client_id",
  "token_type",
  "/oauth/token",
  "/oauth/revoke",
];

const FIELD_PATTERN = new RegExp(`(\`[^\`]+\`|${FIELD_NAMES.map((name) => name.replaceAll("/", "\\/")).join("|")})`, "g");

export function GuideProse({ text, className }: { text: string; className?: string }) {
  const parts = text.split(FIELD_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        const isBacktick = part.startsWith("`") && part.endsWith("`");
        const isField = isBacktick || FIELD_NAMES.includes(part);

        if (!isField) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <code key={`${part}-${index}`} className="font-mono text-[13px] text-[#141F25]">
            {isBacktick ? part.slice(1, -1) : part}
          </code>
        );
      })}
    </span>
  );
}

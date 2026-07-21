// Who counts as an admin. The ADMIN_EMAIL env var holds one email, or several
// separated by commas (e.g. "me@site.com, manager@site.com"). Anyone signed in
// with a listed email gets full admin access. Matching is case-insensitive,
// since email addresses are.
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

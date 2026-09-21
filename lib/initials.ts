export function getInitials(name: string): string {
  // Used on the project list and task detail views to render a compact two-letter avatar badge for a user.
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

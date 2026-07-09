export function getInitials(name: string, fallback = 'IH') {
  if (!name.trim()) return fallback

  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || fallback
  )
}

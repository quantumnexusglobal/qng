// Share-intent link builders — open each platform's native "compose/share"
// dialog pre-filled with the given content. No API keys or OAuth needed;
// the person clicking still confirms the post on that platform themselves.

export function getLinkedInIntentUrl(url: string): string {
  // LinkedIn's share-offsite endpoint only accepts a URL — it pulls
  // title/description/image from that page's Open Graph tags.
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function getTwitterIntentUrl(text: string, url?: string): string {
  const params = new URLSearchParams({ text });
  if (url) params.set("url", url);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getWhatsAppIntentUrl(text: string, url?: string): string {
  return `https://wa.me/?text=${encodeURIComponent(url ? `${text}\n\n${url}` : text)}`;
}

export function getFacebookIntentUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

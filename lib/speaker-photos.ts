// Shared name → headshot lookup, matching components/landing/speakers-section.tsx

const SPEAKER_PHOTOS: Record<string, string> = {
  'emmanuel umukoro': '/speakers/emmanuelumukoro.jpg',
  'sergey grigorovich': '/speakers/sergeygrigorovich.jpg',
  'smriti bajaj': '/speakers/smriti bajaj.jpg',
  'srivathan': '/speakers/srivathan.jpg',
};

/** Looks up a speaker's photo by matching their name anywhere in the given string. */
export function getSpeakerPhoto(name: string): string | undefined {
  const normalized = name.trim().toLowerCase();
  const match = Object.keys(SPEAKER_PHOTOS).find((key) => normalized.includes(key));
  return match ? SPEAKER_PHOTOS[match] : undefined;
}

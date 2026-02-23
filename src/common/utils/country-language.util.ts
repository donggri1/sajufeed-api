/**
 * 국가 코드(ISO 3166-1 alpha-2)로 해당 국가의 주요 언어명을 반환
 */
const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  KR: '한국어',
  JP: '日本語',
  CN: '中文',
  TW: '繁體中文',
  US: 'English',
  GB: 'English',
  CA: 'English',
  AU: 'English',
  NZ: 'English',
  DE: 'Deutsch',
  FR: 'Français',
  ES: 'Español',
  MX: 'Español',
  AR: 'Español',
  IT: 'Italiano',
  PT: 'Português',
  BR: 'Português',
  RU: 'Русский',
  IN: 'हिन्दी',
  TH: 'ภาษาไทย',
  VN: 'Tiếng Việt',
  ID: 'Bahasa Indonesia',
  MY: 'Bahasa Melayu',
  PH: 'Filipino',
  TR: 'Türkçe',
  SA: 'العربية',
  AE: 'العربية',
  EG: 'العربية',
  PL: 'Polski',
  NL: 'Nederlands',
  SE: 'Svenska',
  NO: 'Norsk',
  DK: 'Dansk',
  FI: 'Suomi',
  UA: 'Українська',
  CZ: 'Čeština',
  HU: 'Magyar',
  RO: 'Română',
  GR: 'Ελληνικά',
};

export function getLanguageByCountryCode(countryCode: string | null): string | null {
  if (!countryCode) return null;
  return COUNTRY_LANGUAGE_MAP[countryCode.toUpperCase()] ?? null;
}

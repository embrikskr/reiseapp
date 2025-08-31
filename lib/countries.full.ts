export const ISO_COUNTRIES = ['NO','SE','DK','FI','IS','US','GB','FR','DE','ES','IT','NL','BE','PT','PL','EE','LV','LT','CZ','SK','HU','RO','BG','GR','IE','CH','AT','AU','NZ','CA','JP','CN','KR','TH','VN','IN','BR','AR','ZA','EG','MA','TR','AE','SA','IL','MX','CL','PE','CO','SG','MY','ID','PH','TW','HK','RU','UA','XK'] as const
export type CountryCode = typeof ISO_COUNTRIES[number]
const OFFSET = 127397
export function codeToFlag(code: string) { if (!code || code.length < 2) return code; const cc = code.toUpperCase(); return String.fromCodePoint(cc.charCodeAt(0)+OFFSET, cc.charCodeAt(1)+OFFSET) }
export function getCountries(locale: string = 'nb') { const display = new Intl.DisplayNames([locale], { type: 'region' }); return (ISO_COUNTRIES as readonly string[]).map(code => ({ code, name: display.of(code) || code, flag: codeToFlag(code) })) }
export function nameFor(code: string, locale: string = 'nb') { const display = new Intl.DisplayNames([locale], { type: 'region' }); return display.of(code) || code }
export const WORLD_COUNTRY_COUNT = 195;
export const CONTINENT_LABELS = { AF:'Afrika', AS:'Asia', EU:'Europa', NA:'Nord-Amerika', SA:'Sør-Amerika', OC:'Oseania', AN:'Antarktis' } as const
export const CONTINENT_BY_COUNTRY: Record<string, keyof typeof CONTINENT_LABELS> = {
  NO:'EU', SE:'EU', DK:'EU', FI:'EU', IS:'EU',
  GB:'EU', FR:'EU', DE:'EU', ES:'EU', IT:'EU', NL:'EU', BE:'EU', PT:'EU', PL:'EU', EE:'EU', LV:'EU', LT:'EU', CZ:'EU', SK:'EU', HU:'EU', RO:'EU', BG:'EU', GR:'EU', IE:'EU', CH:'EU', AT:'EU', UA:'EU', RU:'EU', XK:'EU',
  US:'NA', CA:'NA', MX:'NA',
  BR:'SA', AR:'SA', CL:'SA', PE:'SA', CO:'SA',
  JP:'AS', CN:'AS', KR:'AS', TH:'AS', VN:'AS', IN:'AS', SG:'AS', MY:'AS', ID:'AS', PH:'AS', TW:'AS', HK:'AS', IL:'AS', TR:'AS', AE:'AS', SA:'AS',
  AU:'OC', NZ:'OC',
  ZA:'AF', EG:'AF', MA:'AF'
}
export function continentOf(code: string){ return CONTINENT_BY_COUNTRY[code.toUpperCase()] || 'EU' }

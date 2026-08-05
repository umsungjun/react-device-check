import type { DeviceType, OS, UADataLike } from '../types';

export interface Fixture {
  name: string;
  ua: string;
  uaData?: UADataLike;
  maxTouchPoints?: number;
  platform?: string;
  screen?: { width: number; height: number };
  expected: { type: DeviceType; os: OS };
}

const CHROME_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';
const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';
const CHROME_LINUX =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';
const CHROME_ANDROID_PHONE =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36';
const CHROME_ANDROID_TABLET =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';
const SAFARI_DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
const SAMSUNG_DEX =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Safari/537.36';

// Real-world UA strings (2026): frozen/reduced Chromium UAs, the iOS 26 frozen UA, UA-reduction era Samsung Internet, plus pre-reduction legacy strings.
export const FIXTURES: Fixture[] = [
  // ── A. Chromium with Client Hints (Tier 1) ──────────────────────────
  {
    name: 'Chrome 146 Windows desktop',
    ua: CHROME_WIN,
    uaData: { mobile: false, platform: 'Windows' },
    maxTouchPoints: 0,
    platform: 'Win32',
    expected: { type: 'desktop', os: 'windows' },
  },
  {
    name: 'Chrome Windows touch laptop (mtp must not flip it)',
    ua: CHROME_WIN,
    uaData: { mobile: false, platform: 'Windows' },
    maxTouchPoints: 10,
    platform: 'Win32',
    expected: { type: 'desktop', os: 'windows' },
  },
  {
    name: 'Chrome macOS (frozen 10_15_7 UA)',
    ua: CHROME_MAC,
    uaData: { mobile: false, platform: 'macOS' },
    maxTouchPoints: 0,
    platform: 'MacIntel',
    expected: { type: 'desktop', os: 'macos' },
  },
  {
    name: 'Chrome Linux desktop',
    ua: CHROME_LINUX,
    uaData: { mobile: false, platform: 'Linux' },
    maxTouchPoints: 0,
    platform: 'Linux x86_64',
    expected: { type: 'desktop', os: 'linux' },
  },
  {
    name: 'Chrome Android phone (reduced UA, model K)',
    ua: CHROME_ANDROID_PHONE,
    uaData: { mobile: true, platform: 'Android' },
    maxTouchPoints: 5,
    platform: 'Linux armv81',
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Chrome Android tablet (uaData.mobile=false, no Mobile token)',
    ua: CHROME_ANDROID_TABLET,
    uaData: { mobile: false, platform: 'Android' },
    maxTouchPoints: 5,
    platform: 'Linux armv81',
    expected: { type: 'tablet', os: 'android' },
  },
  {
    name: 'Chrome Android "Request desktop site" (Linux UA, Linux platform)',
    ua: CHROME_LINUX,
    uaData: { mobile: false, platform: 'Linux' },
    maxTouchPoints: 5,
    expected: { type: 'desktop', os: 'linux' },
  },
  {
    name: 'Edge Windows',
    ua: `${CHROME_WIN} Edg/146.0.0.0`,
    uaData: { mobile: false, platform: 'Windows' },
    maxTouchPoints: 0,
    platform: 'Win32',
    expected: { type: 'desktop', os: 'windows' },
  },
  {
    name: 'Samsung Internet Android phone',
    ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36',
    uaData: { mobile: true, platform: 'Android' },
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Samsung DeX (uaData platform Android)',
    ua: SAMSUNG_DEX,
    uaData: { mobile: false, platform: 'Android' },
    maxTouchPoints: 5,
    expected: { type: 'desktop', os: 'android' },
  },
  {
    name: 'Samsung DeX (uaData platform Linux, SamsungBrowser fix-up)',
    ua: SAMSUNG_DEX,
    uaData: { mobile: false, platform: 'Linux' },
    maxTouchPoints: 5,
    expected: { type: 'desktop', os: 'android' },
  },
  {
    name: 'ChromeOS (maps to linux)',
    ua: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    uaData: { mobile: false, platform: 'Chrome OS' },
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'linux' },
  },
  {
    name: 'Unknown future uaData platform (os falls back to UA sniff)',
    ua: CHROME_ANDROID_PHONE,
    uaData: { mobile: true, platform: 'Fuchsia' },
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Empty uaData platform (os falls back to UA sniff)',
    ua: CHROME_ANDROID_PHONE,
    uaData: { mobile: true, platform: '' },
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Opera Android phone',
    ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 OPR/86.0.0.0',
    uaData: { mobile: true, platform: 'Android' },
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },

  // ── B. iOS / WebKit (Tier 2 — no uaData ever exists on iOS) ─────────
  {
    name: 'iPhone Safari (iOS 26 frozen UA)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    platform: 'iPhone',
    screen: { width: 390, height: 844 },
    expected: { type: 'mobile', os: 'ios' },
  },
  {
    name: 'Old iPhone (iOS 12)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    platform: 'iPhone',
    expected: { type: 'mobile', os: 'ios' },
  },
  {
    name: 'iPod touch',
    ua: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    platform: 'iPod touch',
    expected: { type: 'mobile', os: 'ios' },
  },
  {
    name: 'iPad "Request Mobile Website" (explicit iPad token)',
    ua: 'Mozilla/5.0 (iPad; CPU OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    platform: 'iPad',
    expected: { type: 'tablet', os: 'ios' },
  },
  {
    name: 'iPad desktop mode (iPadOS 13+ default — Macintosh UA unmasked)',
    ua: SAFARI_DESKTOP_UA,
    maxTouchPoints: 5,
    platform: 'MacIntel',
    screen: { width: 820, height: 1180 },
    expected: { type: 'tablet', os: 'ios' },
  },
  {
    name: 'iPad desktop mode without screen input (defaults to tablet)',
    ua: SAFARI_DESKTOP_UA,
    maxTouchPoints: 5,
    platform: 'MacIntel',
    expected: { type: 'tablet', os: 'ios' },
  },
  {
    name: 'iPhone "Request Desktop Website" (screen tie-break to mobile)',
    ua: SAFARI_DESKTOP_UA,
    maxTouchPoints: 5,
    platform: 'MacIntel',
    screen: { width: 390, height: 844 },
    expected: { type: 'mobile', os: 'ios' },
  },
  {
    name: 'Real Mac Safari (mtp 0)',
    ua: SAFARI_DESKTOP_UA,
    maxTouchPoints: 0,
    platform: 'MacIntel',
    screen: { width: 1512, height: 982 },
    expected: { type: 'desktop', os: 'macos' },
  },
  {
    name: 'Mac with maxTouchPoints=1 quirk (threshold is > 1)',
    ua: SAFARI_DESKTOP_UA,
    maxTouchPoints: 1,
    platform: 'MacIntel',
    expected: { type: 'desktop', os: 'macos' },
  },
  {
    name: 'Chrome iOS (CriOS — WebKit shell, no uaData)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/146.0.0.0 Mobile/15E148 Safari/604.1',
    maxTouchPoints: 5,
    platform: 'iPhone',
    expected: { type: 'mobile', os: 'ios' },
  },
  {
    name: 'Firefox iOS on iPad (FxiOS)',
    ua: 'Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/136.0 Mobile/15E148 Safari/605.1.15',
    maxTouchPoints: 5,
    platform: 'iPad',
    expected: { type: 'tablet', os: 'ios' },
  },
  {
    name: 'iOS WKWebView (no Safari token)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    maxTouchPoints: 5,
    platform: 'iPhone',
    expected: { type: 'mobile', os: 'ios' },
  },

  // ── C. Firefox (Tier 2 — no uaData) ─────────────────────────────────
  {
    name: 'Firefox Android phone (Mobile token)',
    ua: 'Mozilla/5.0 (Android 15; Mobile; rv:136.0) Gecko/136.0 Firefox/136.0',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Firefox Android tablet (Tablet token, no Mobile)',
    ua: 'Mozilla/5.0 (Android 15; Tablet; rv:136.0) Gecko/136.0 Firefox/136.0',
    maxTouchPoints: 5,
    expected: { type: 'tablet', os: 'android' },
  },
  {
    name: 'Firefox Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
    maxTouchPoints: 0,
    platform: 'Win32',
    expected: { type: 'desktop', os: 'windows' },
  },
  {
    name: 'Firefox macOS (capped 10.15 UA)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0',
    maxTouchPoints: 0,
    platform: 'MacIntel',
    expected: { type: 'desktop', os: 'macos' },
  },
  {
    name: 'Firefox Linux',
    ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0',
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'linux' },
  },

  // ── D. WebViews / legacy ────────────────────────────────────────────
  {
    name: 'KakaoTalk Android in-app WebView',
    ua: 'Mozilla/5.0 (Linux; Android 10; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/137.0.0.0 Mobile Safari/537.36 KAKAOTALK/25.4.3 (INAPP)',
    uaData: { mobile: true, platform: 'Android' },
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Android tablet WebView (wv, no Mobile token)',
    ua: 'Mozilla/5.0 (Linux; Android 10; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/137.0.0.0 Safari/537.36',
    uaData: { mobile: false, platform: 'Android' },
    maxTouchPoints: 5,
    expected: { type: 'tablet', os: 'android' },
  },
  {
    name: 'Legacy Android 4.4 phone (pre-reduction, no uaData)',
    ua: 'Mozilla/5.0 (Linux; Android 4.4.2; SM-G900F Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Legacy Android 9 tablet (pre-reduction, no uaData)',
    ua: 'Mozilla/5.0 (Linux; Android 9; SM-T510) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.119 Safari/537.36',
    maxTouchPoints: 5,
    expected: { type: 'tablet', os: 'android' },
  },
  {
    name: 'Googlebot smartphone (classified per emulated device)',
    ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    maxTouchPoints: 0,
    expected: { type: 'mobile', os: 'android' },
  },

  // ── E. TVs, dead/niche mobile platforms, HarmonyOS ──────────────────
  {
    name: 'Fire TV Stick (Silk, Android UA without Mobile token)',
    ua: 'Mozilla/5.0 (Linux; Android 9; AFTKMST12 Build/PS7233) AppleWebKit/537.36 (KHTML, like Gecko) Silk/94.2.7 like Chrome/94.0.4606.31 Safari/537.36',
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'android' },
  },
  {
    name: 'Nvidia Shield Android TV WebView',
    ua: 'Mozilla/5.0 (Linux; Android 11; SHIELD Android TV; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.0.0 Safari/537.36',
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'android' },
  },
  {
    name: 'Android TV Chromium browser with Client Hints',
    ua: 'Mozilla/5.0 (Linux; Android 12; BRAVIA 4K VH2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    uaData: { mobile: false, platform: 'Android' },
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'android' },
  },
  {
    name: 'Opera Mini (Presto server UA, phone-only browser)',
    ua: 'Opera/9.80 (Android; Opera Mini/8.0.1807/36.1609; U; en) Presto/2.12.423 Version/12.16',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'android' },
  },
  {
    name: 'Windows Phone 8.1 (IEMobile carries the Mobi marker)',
    ua: 'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 630) like Gecko',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'windows' },
  },
  {
    name: 'Tizen phone (Samsung Z1, Mobile token on a Linux UA)',
    ua: 'Mozilla/5.0 (Linux; Tizen 2.3; SAMSUNG SM-Z130H) AppleWebKit/537.3 (KHTML, like Gecko) Version/2.3 Mobile Safari/537.3',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'linux' },
  },
  {
    name: 'HarmonyOS NEXT phone (ArkWeb, no Android layer)',
    ua: 'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1 Mobile',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'unknown' },
  },
  {
    name: 'HarmonyOS NEXT tablet (ArkWeb Tablet token)',
    ua: 'Mozilla/5.0 (Tablet; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1',
    maxTouchPoints: 5,
    expected: { type: 'tablet', os: 'unknown' },
  },

  // ── F. Degenerate inputs ────────────────────────────────────────────
  {
    name: 'Empty UA and no uaData (falls back)',
    ua: '',
    maxTouchPoints: 0,
    expected: { type: 'desktop', os: 'unknown' },
  },
  {
    name: 'jsdom default UA (lowercase darwin token must not match)',
    ua: 'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/27.4.0',
    maxTouchPoints: 0,
    platform: '',
    expected: { type: 'desktop', os: 'unknown' },
  },
  {
    name: 'Generic mobile catch-all (Mobi token, unknown OS)',
    ua: 'Mozilla/5.0 (Unknown; Mobile) Gecko/20100101',
    maxTouchPoints: 5,
    expected: { type: 'mobile', os: 'unknown' },
  },
];

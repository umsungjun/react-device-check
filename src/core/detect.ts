import type { DetectionInput, DetectOptions, DeviceType, OS } from '../types';

// Chromium userAgentData.platform → OS. Unknown/future values fall through to UA sniffing.
// 'Chrome OS' maps to linux because the v1 union has no dedicated value (documented limitation).
const UA_DATA_PLATFORM_MAP: Record<string, OS> = {
  Android: 'android',
  'Chrome OS': 'linux',
  iOS: 'ios',
  Linux: 'linux',
  macOS: 'macos',
  Windows: 'windows',
};

// Phone-class shortest screen side in CSS px: the largest iPhone is ~440, the smallest iPad is 744.
const PHONE_SCREEN_MAX = 600;

// TV form factors (Android TV, Fire TV 'AFT*' models, Chromecast 'CrKey', Sony BRAVIA, Roku). Android TV UAs carry 'Android' without 'Mobile', which would otherwise land in the tablet bucket, the wrongest fit for a 10-foot no-touch UI; with a three-way taxonomy, desktop is the best fit. \bTV\b also covers 'SMART-TV' and 'Android TV'; SmartTV/GoogleTV lack the word boundary and are listed explicitly.
const TV_UA = /\bTV\b|SmartTV|GoogleTV|CrKey|Roku|\bAFT[A-Z0-9]|BRAVIA/;

// All regexes are case-sensitive on purpose: real UA tokens are cased exactly like this, and case-sensitivity keeps lowercase tokens such as jsdom's '(darwin)' out of the Mac/Linux buckets.
function sniffOS(ua: string): OS {
  // Order matters: iPhone UAs contain 'like Mac OS X' and Android UAs contain 'Linux'.
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Mac/.test(ua)) return 'macos';
  if (/Windows/.test(ua)) return 'windows';
  if (/Linux|X11|CrOS/.test(ua)) return 'linux';
  return 'unknown';
}

/**
 * Pure device detection engine. Same input always produces the same output, with no globals and no media queries.
 *
 * Signal priority: Client Hints (`uaData`, authoritative when present; only Chromium exposes it) → UA string cross-checked with `maxTouchPoints` (Safari/Firefox/WebViews) → fallback.
 *
 * Works anywhere: pass `navigator`-derived values on the client or a request's `user-agent` header on the server.
 */
export function detectDevice(
  input?: DetectionInput,
  options?: DetectOptions
): { type: DeviceType; os: OS } {
  const fallback = {
    type: options?.fallback?.type ?? ('desktop' as DeviceType),
    os: options?.fallback?.os ?? ('unknown' as OS),
  };

  // STEP 0: no usable signals (SSR, bare React Native).
  if (!input || (!input.ua && !input.uaData)) return fallback;

  const ua = input.ua ?? '';
  const maxTouchPoints = input.maxTouchPoints ?? 0;
  const uaData = input.uaData;

  // TIER 1: Chromium Client Hints. Safe to trust first: no iOS browser ever exposes userAgentData (they are all WebKit), so the iPad-as-Mac unmasking below is never bypassed.
  if (uaData && typeof uaData.mobile === 'boolean') {
    let os = UA_DATA_PLATFORM_MAP[uaData.platform ?? ''] ?? sniffOS(ua);
    // Samsung DeX / desktop-mode requests report a Linux platform while the UA keeps the SamsungBrowser token, so it is effectively always an Android device in desktop clothing.
    if (os === 'linux' && /SamsungBrowser/.test(ua)) os = 'android';
    if (uaData.mobile) return { type: 'mobile', os };
    if (os === 'android') {
      // mobile === false on Android: an Android UA without the 'Mobile' token is a tablet (Google's official rule), unless it is a TV. A UA that dropped the Android token entirely is a desktop-form request (Samsung DeX, "Request desktop site").
      return {
        type: /Android/.test(ua) && !TV_UA.test(ua) ? 'tablet' : 'desktop',
        os,
      };
    }
    // Windows/macOS/Linux/ChromeOS with mobile === false: desktop. maxTouchPoints is intentionally ignored here so touch laptops and Surface devices stay desktop.
    return { type: 'desktop', os };
  }

  // TIER 2: UA string + touch cross-checks (Safari, Firefox, WebViews, legacy Chromium).

  // iPhone/iPod before any Mac check: their UAs contain 'like Mac OS X'.
  if (/iPhone|iPod/.test(ua)) return { type: 'mobile', os: 'ios' };
  if (/iPad/.test(ua)) return { type: 'tablet', os: 'ios' };

  if (/Mac/.test(ua) || (input.platform ?? '').indexOf('Mac') === 0) {
    if (maxTouchPoints > 1) {
      // A multitouch "Mac" is an Apple mobile device masquerading via a desktop UA (iPadOS 13+ default, or iPhone "Request Desktop Website"). Real Macs report 0 (rarely 1) touch points.
      // The screen's shortest side separates desktop-mode iPhones from iPads; when unavailable we default to tablet, the overwhelmingly common case.
      const s = input.screen;
      const shortSide = s ? Math.min(s.width, s.height) : Infinity;
      return {
        type: shortSide < PHONE_SCREEN_MAX ? 'mobile' : 'tablet',
        os: 'ios',
      };
    }
    return { type: 'desktop', os: 'macos' };
  }

  // Android before Windows/Linux: 'Linux; Android' UAs contain 'Linux', and legacy 'Windows Phone ... Android' UAs deliberately land here.
  if (/Android/.test(ua)) {
    if (TV_UA.test(ua)) return { type: 'desktop', os: 'android' };
    // 'Mobi' (covers 'Mobile') present = phone; absent = tablet. Firefox Android's explicit 'Tablet' token is covered by the absence rule. Opera Mini's Presto-era server UA lacks 'Mobi' but runs only on phones.
    return {
      type: /Mobi|Opera Mini/.test(ua) ? 'mobile' : 'tablet',
      os: 'android',
    };
  }

  // HarmonyOS NEXT dropped the Android layer; ArkWeb UAs carry Phone/Tablet form-factor tokens instead. The v1 OS union has no harmony value, so os stays 'unknown'.
  if (/OpenHarmony/.test(ua)) {
    return { type: /Tablet/.test(ua) ? 'tablet' : 'mobile', os: 'unknown' };
  }

  // Generic mobile catch-all BEFORE the desktop OS families: Windows Phone ('IEMobile'), Tizen and Sailfish phones ('Mobile') carry desktop OS tokens plus an explicit mobile marker, and no legitimate desktop UA contains 'Mobi' (MDN rule).
  if (/Mobi/.test(ua)) return { type: 'mobile', os: sniffOS(ua) };

  if (/Windows/.test(ua)) return { type: 'desktop', os: 'windows' };

  if (/Linux|X11|CrOS/.test(ua)) {
    // X11/Linux + SamsungBrowser is effectively always Samsung DeX: a desktop experience (per Samsung's guidance) on an Android device.
    return {
      type: 'desktop',
      os: /SamsungBrowser/.test(ua) ? 'android' : 'linux',
    };
  }

  return fallback; // e.g. jsdom's 'Mozilla/5.0 (darwin) ... jsdom/x.y.z'
}

/**
 * Device class derived from user agent signals, fixed for the page session.
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Operating system family. `unknown` is returned when no signal matches (e.g. server-side rendering, exotic embedders, bots with stripped UAs).
 */
export type OS = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';

/** Viewport orientation, reactive via `matchMedia('(orientation: portrait)')`. */
export type Orientation = 'portrait' | 'landscape';

/**
 * UA-derived values, fixed for the lifetime of the page session.
 * Computed once from `navigator.userAgentData` (Chromium) or the UA string, cross-checked with `maxTouchPoints` to unmask iPads that masquerade as Macs.
 */
export interface StaticDeviceInfo {
  type: DeviceType;
  os: OS;
  /** Sugar for `type === 'mobile'`. */
  isMobile: boolean;
  /** Sugar for `type === 'tablet'`. */
  isTablet: boolean;
  /** Sugar for `type === 'desktop'`. */
  isDesktop: boolean;
}

/** Full snapshot returned by `useDevice()`. */
export interface DeviceInfo extends StaticDeviceInfo {
  /**
   * Reactive: the primary pointer is coarse (touch). Flips live when e.g. a mouse is attached in Samsung DeX or an iPad enters Stage Manager.
   */
  isTouchPrimary: boolean;
  /** Reactive: current viewport orientation. */
  orientation: Orientation;
  /**
   * `false` on the server and during the hydration first paint, `true` once the live client snapshot has taken over.
   * Use it to render neutral placeholders when the first paint must not guess.
   */
  isHydrated: boolean;
}

/**
 * Detection signals consumed by {@link detectDevice}. Every field is optional and injectable, which makes the engine pure and lets servers pass request-derived values (e.g. the `user-agent` header).
 */
export interface DetectionInput {
  /** The user agent string (`navigator.userAgent` or a `user-agent` request header). */
  ua?: string;
  /** Low-entropy User-Agent Client Hints (`navigator.userAgentData`, Chromium only). */
  uaData?: UADataLike | null;
  /** `navigator.maxTouchPoints`. Used to unmask Apple touch devices sending desktop UAs. */
  maxTouchPoints?: number;
  /** `navigator.platform` (deprecated but still the most reliable iPad-as-Mac signal). */
  platform?: string;
  /** `screen.width`/`screen.height` in CSS px. Only consulted to split desktop-mode iPhones from iPads. */
  screen?: { width: number; height: number };
}

/** Structurally compatible with the Chromium-only `NavigatorUAData`. */
export interface UADataLike {
  mobile?: boolean;
  platform?: string;
}

/** Options for {@link detectDevice}. */
export interface DetectOptions {
  /** Returned when no usable signals exist (SSR/Node). Defaults to `desktop` / `unknown`. */
  fallback?: Partial<Pick<StaticDeviceInfo, 'type' | 'os'>>;
}

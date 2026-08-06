import { Inter, JetBrains_Mono } from 'next/font/google';

// Self-hosted via next/font at build time — no external requests at runtime, zero CLS
export const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

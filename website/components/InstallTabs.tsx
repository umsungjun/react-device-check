'use client';

import { useEffect, useState } from 'react';
import { INSTALL_COMMANDS } from '@/content/code';

interface InstallTabsProps {
  strings: { copyHint: string; copied: string };
}

export default function InstallTabs({ strings }: InstallTabsProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      // Clipboard API is absent in insecure contexts and can reject on permissions
      await navigator.clipboard.writeText(INSTALL_COMMANDS[active].command);
      setCopied(true);
    } catch {
      // Copy silently failed — keep the hint label so the UI never claims success
    }
  };

  return (
    <div className="install-tabs">
      <div className="install-tabs-bar">
        {INSTALL_COMMANDS.map((item, index) => (
          <button
            key={item.pm}
            type="button"
            className="pm-tab"
            aria-pressed={index === active}
            onClick={() => {
              setActive(index);
              setCopied(false);
            }}
          >
            {item.pm}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="install-cmd"
        onClick={handleCopy}
        title={strings.copyHint}
      >
        <span className="install-cmd-text">
          {INSTALL_COMMANDS[active].command}
        </span>
        <span
          className={copied ? 'copy-state copy-state-ok' : 'copy-state'}
          aria-live="polite"
        >
          {copied ? strings.copied : strings.copyHint}
        </span>
      </button>
    </div>
  );
}

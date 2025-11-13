/// <reference types="vite/client" />

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface Window {
  deferredPrompt?: BeforeInstallPromptEvent | null;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

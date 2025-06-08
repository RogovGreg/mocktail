/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react';

  /** Именованный экспорт, как у create-react-app */
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  /** Default-импорт — URL к файлу */
  const src: string;
  export default src;
}

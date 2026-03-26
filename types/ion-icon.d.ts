import type * as React from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ion-icon': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            name?: string
            icon?: string
            src?: string
            size?: string
          },
          HTMLElement
        >
      }
    }
  }
}

export {}

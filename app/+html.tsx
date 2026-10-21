import { type PropsWithChildren } from 'react';

// Browser scrolling intentionally replaces Expo's fixed-root ScrollView reset.
export default function RootHtml({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F7F7F3" />
        <meta name="description" content="Flexbox — software engineering, design, and digital products." />
        <title>Flexbox</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

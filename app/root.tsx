import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import twStyle from "./styles/tailwind.css";
import custStyle from "./styles/custom.css";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: twStyle },
  { rel: "stylesheet", href: custStyle },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <p className="w-full text-center text-xs mb-5 text-stone-500 font-sans">
          DeltaActions | Delta #2
        </p>
      </body>
    </html>
  );
}

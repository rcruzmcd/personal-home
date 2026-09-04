import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { LOCALE_COOKIE } from "@/lib/i18n/locales"
import { resolveLocaleRoute } from "@/lib/i18n/routing"

// Next 16 renamed the `middleware` file convention to `proxy`
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
//
// Every route lives under `app/[locale]`, but English is served without a
// prefix. This adapter maps public URLs onto that internal shape: it is a thin
// wrapper over resolveLocaleRoute, which holds the actual policy and is unit
// tested in @/lib/i18n/__tests__/routing.test.ts.
export function proxy(request: NextRequest) {
  const route = resolveLocaleRoute(
    request.nextUrl.pathname,
    request.cookies.get(LOCALE_COOKIE)?.value
  )

  if (route.kind === "pass") return NextResponse.next()

  // Clone rather than build from scratch so query strings and hashes survive.
  const url = request.nextUrl.clone()
  url.pathname = route.pathname

  // 308 keeps the method and tells crawlers the unprefixed URL is canonical.
  return route.kind === "redirect"
    ? NextResponse.redirect(url, 308)
    : NextResponse.rewrite(url)
}

export const config = {
  // Skip the API, Next's internals, and anything with a file extension: those
  // are not localized pages and rewriting them would break asset requests.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

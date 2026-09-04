"use client"

import Link from "next/link"
import * as React from "react"

import { useLocale } from "@/components/i18n/i18n-provider"
import { localizeHref } from "@/lib/i18n/routing"

type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  // Always the locale-independent path ("/work"), never a prefixed one — the
  // prefix is this component's job.
  href: string
}

/**
 * next/link with the active locale's prefix applied. Use it for every internal
 * link so a visitor reading in Spanish stays in Spanish; plain <Link> is still
 * correct for external URLs and for hrefs that are already localized.
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale()
  return <Link href={localizeHref(href, locale)} {...props} />
}

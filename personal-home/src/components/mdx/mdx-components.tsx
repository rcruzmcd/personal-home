import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import Image from "next/image"

import { AccentBar } from "@/components/ui/accent-bar"

export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  h2: ({ children }) => (
    <div className="mt-8 mb-4">
      <AccentBar width="md" className="mb-4" />
      <h2 className="text-h2 font-semibold text-purple">{children}</h2>
    </div>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-h3 font-semibold text-purple">{children}</h3>
  ),
  p: ({ children }) => <p className="text-body text-foreground">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 text-body text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6 text-body text-foreground">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-green bg-background p-6 font-serif text-h4 text-foreground">
      {children}
    </blockquote>
  ),
  img: (props) => {
    const { src, alt } = props as { src?: string; alt?: string }
    if (!src) return null
    return (
      <span className="block overflow-hidden rounded-xl">
        <Image src={src} alt={alt ?? ""} width={1200} height={800} className="w-full" />
      </span>
    )
  },
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-purple underline transition-colors duration-200 hover:text-[#4A2A5F] hover:italic"
    >
      {children}
    </a>
  ),
}

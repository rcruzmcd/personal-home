export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main-content"
      className="print:hidden sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-purple focus:px-4 focus:py-2 focus:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
    >
      {label}
    </a>
  )
}

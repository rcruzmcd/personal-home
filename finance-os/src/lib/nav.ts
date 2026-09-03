// The app's primary navigation, in one place so the desktop row and the
// mobile drawer can never drift apart.
//
// Ordering follows the data's own dependency: the records you keep
// (Accounts → Transactions → Income → Recurring → Budgets), then the views
// derived from them (Calendar → Debt → Forecast), then the queue of things
// needing attention (Inbox).
//
// Budgets sits last among the records because a limit is only meaningful once
// there are categorized transactions to measure it against.
export const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/income", label: "Income" },
  { href: "/recurring", label: "Recurring" },
  { href: "/budgets", label: "Budgets" },
  { href: "/calendar", label: "Calendar" },
  { href: "/debt", label: "Debt" },
  { href: "/forecast", label: "Forecast" },
  { href: "/inbox", label: "Inbox" },
] as const;

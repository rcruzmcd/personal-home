import { screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithI18n as render } from "@/test/i18n"
import { PageHeader } from "@/components/content/page-header";

test("renders the title as the page h1", () => {
  render(<PageHeader title="Work" description="Case studies." />);

  expect(screen.getByRole("heading", { level: 1, name: "Work" })).toBeInTheDocument();
  expect(screen.getByText("Case studies.")).toBeInTheDocument();
});

test("renders no breadcrumb when there is no trail", () => {
  render(<PageHeader title="Work" />);

  expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).not.toBeInTheDocument();
});

test("links every trail node and leaves the current page unlinked", () => {
  render(
    <PageHeader title="Chatter Snow" breadcrumb={[{ label: "Work", href: "/work" }]} />
  );

  expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
  expect(screen.queryByRole("link", { name: "Chatter Snow" })).not.toBeInTheDocument();
});

test("renders stats and actions when given", () => {
  render(
    <PageHeader
      title="Resume"
      stats={<p>10+ years</p>}
      actions={<button type="button">Download PDF</button>}
    />
  );

  expect(screen.getByText("10+ years")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Download PDF" })).toBeInTheDocument();
});

test("compact drops the title to h2", () => {
  render(<PageHeader title="Edit" compact />);

  expect(screen.getByRole("heading", { level: 1, name: "Edit" })).toHaveClass("text-h2");
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Button } from "@/components/ui/button";

test("renders children and defaults to the primary variant", () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole("button", { name: "Click me" });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute("data-variant", "primary");
});

test("applies the requested variant", () => {
  render(<Button variant="secondary">Secondary</Button>);

  expect(screen.getByRole("button", { name: "Secondary" })).toHaveAttribute(
    "data-variant",
    "secondary"
  );
});

test("fires onClick when clicked", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Submit</Button>);

  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("is disabled when the disabled prop is set", () => {
  render(<Button disabled>Disabled</Button>);

  expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
});

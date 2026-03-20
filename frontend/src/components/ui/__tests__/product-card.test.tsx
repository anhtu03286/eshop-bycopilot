import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/ui/product-card";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ProductCard", () => {
  it("renders product info", () => {
    render(
      <ProductCard
        product={{
          id: "p1",
          name: "Classic Tee",
          slug: "classic-tee",
          description: "Soft cotton",
          priceCents: 2500,
          currency: "usd",
          inventory: 10,
          isActive: true,
          images: [],
        }}
      />,
    );

    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("Soft cotton")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("calls add callback", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(
      <ProductCard
        product={{
          id: "p1",
          name: "Classic Tee",
          slug: "classic-tee",
          description: "Soft cotton",
          priceCents: 2500,
          currency: "usd",
          inventory: 10,
          isActive: true,
          images: [],
        }}
        onAddToCart={onAdd}
      />,
    );

    const addButtons = screen.getAllByRole("button", { name: "Add" });
    await user.click(addButtons[0]);
    expect(onAdd).toHaveBeenCalledWith("p1");
  });
});

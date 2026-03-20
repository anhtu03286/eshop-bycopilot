import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminTable } from "@/components/ui/admin-table";

describe("AdminTable", () => {
  it("renders headers and rows", () => {
    render(
      <AdminTable
        rows={[{ id: "a1", name: "Alice" }]}
        columns={[
          { key: "id", title: "ID", render: (row) => row.id },
          { key: "name", title: "Name", render: (row) => row.name },
        ]}
      />,
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("a1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <AdminTable
        rows={[]}
        columns={[{ key: "id", title: "ID", render: (row: { id: string }) => row.id }]}
        emptyText="No users"
      />,
    );

    expect(screen.getByText("No users")).toBeInTheDocument();
  });
});

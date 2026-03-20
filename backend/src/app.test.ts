import request from "supertest";
import { createApp } from "./app";

describe("Health endpoint", () => {
  it("returns ok status", async () => {
    const app = createApp();
    const response = await request(app).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

import { describe, expect, it } from "vitest";

import { type HealthResponse } from "@sara-pragya/contracts";

describe("browser-safe contracts", () => {
  it("represents the public health response without configuration details", () => {
    const response: HealthResponse = { status: "ok", service: "SARA-PRAGYA API", version: "0.1.0" };
    expect(Object.keys(response)).toEqual(["status", "service", "version"]);
  });
});

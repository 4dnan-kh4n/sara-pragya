import { describe, expect, it } from "vitest";

import { CLINICAL_DISCLAIMER, type HealthResponse } from "@sara-pragya/contracts";

describe("browser-safe contracts", () => {
  it("keeps the disclaimer independent of UI wording", () => {
    expect(CLINICAL_DISCLAIMER).toContain("not an independent diagnostic test");
    expect(CLINICAL_DISCLAIMER).toContain("qualified healthcare professional");
  });

  it("represents the public health response without configuration details", () => {
    const response: HealthResponse = { status: "ok", service: "SARA-PRAGYA API", version: "0.1.0" };
    expect(Object.keys(response)).toEqual(["status", "service", "version"]);
  });
});

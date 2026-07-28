import { afterEach, describe, expect, it, vi } from "vitest";

import { imageUrl } from "./index";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("imageUrl", () => {
  it("passes paths through unchanged when no base URL is set", () => {
    expect(imageUrl("/images/property/house.jpg")).toBe("/images/property/house.jpg");
  });

  it("normalizes a missing leading slash", () => {
    expect(imageUrl("images/property/house.jpg")).toBe("/images/property/house.jpg");
  });

  it("prefixes the CDN base", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com");
    expect(imageUrl("/images/a.jpg")).toBe("https://cdn.example.com/images/a.jpg");
  });

  it("tolerates a trailing slash on the base (no double slash)", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com/");
    expect(imageUrl("/images/a.jpg")).toBe("https://cdn.example.com/images/a.jpg");
  });

  it("returns absolute and protocol-relative URLs untouched", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_BASE_URL", "https://cdn.example.com");
    expect(imageUrl("https://elsewhere.example/x.jpg")).toBe("https://elsewhere.example/x.jpg");
    expect(imageUrl("//cdn.example.com/x.jpg")).toBe("//cdn.example.com/x.jpg");
  });
});

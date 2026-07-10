import { describe, expect, it } from "vitest";

import { buildInquiryMailtoUrl, buildInquiryTelUrl } from "./index";
import type { Property } from "@/types/property";

const property = {
  name: "Aldebaran Farm",
  contactEmail: "aldebaran.farm.rental@gmail.com",
  contactPhone: "(312) 401-2484",
} as Property;

describe("buildInquiryMailtoUrl", () => {
  it("percent-encodes per RFC 6068 — spaces are %20, never +", () => {
    const url = buildInquiryMailtoUrl(property);
    expect(url.startsWith("mailto:")).toBe(true);
    expect(url).not.toContain("+");
    expect(url).toContain("%20");
  });

  it("round-trips subject and body exactly, including all optional fields", () => {
    const url = buildInquiryMailtoUrl(property, {
      checkIn: "2026-08-01",
      checkOut: "2026-08-04",
      guests: 6,
      message: "We have a dog.",
    });
    const query = url.split("?")[1];
    const params = Object.fromEntries(
      query.split("&").map((pair) => pair.split("=").map((part) => decodeURIComponent(part)))
    );
    expect(params.subject).toBe("Booking inquiry — Aldebaran Farm");
    expect(params.body).toBe(
      [
        "Hi, I'd like to inquire about staying at Aldebaran Farm.",
        "",
        "Check-in: 2026-08-01",
        "Check-out: 2026-08-04",
        "Guests: 6",
        "",
        "We have a dog.",
      ].join("\n")
    );
  });

  it("omits optional fields that aren't provided", () => {
    const url = buildInquiryMailtoUrl(property);
    const body = decodeURIComponent(url.split("body=")[1]);
    expect(body).toBe("Hi, I'd like to inquire about staying at Aldebaran Farm.");
  });

  it("keeps a literal @ in the address (RFC 6068 addr-spec)", () => {
    const url = buildInquiryMailtoUrl(property);
    expect(url.startsWith("mailto:aldebaran.farm.rental@gmail.com?")).toBe(true);
    expect(url).not.toContain("%40");
  });
});

describe("buildInquiryTelUrl", () => {
  it("normalizes a formatted US number", () => {
    expect(buildInquiryTelUrl(property)).toBe("tel:+13124012484");
  });

  it("does not double the country code when the number already has one", () => {
    expect(buildInquiryTelUrl({ ...property, contactPhone: "+1 (312) 401-2484" })).toBe(
      "tel:+13124012484"
    );
    expect(buildInquiryTelUrl({ ...property, contactPhone: "1-312-401-2484" })).toBe(
      "tel:+13124012484"
    );
  });
});

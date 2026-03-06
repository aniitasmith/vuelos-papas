import { describe, it, expect } from "vitest";
import {
  toCAD,
  toUSD,
  fmt,
  uid,
  emptyLeg,
  emptyRoute,
  emptyDomestic,
  flightHoursFromTimes,
  routeTotalCAD,
  routeTotalHours,
  routeStops,
  WEIGHTS,
} from "../flightUtils";
import type { Route, Leg } from "../types";

describe("flightUtils", () => {
  describe("toCAD", () => {
    it("converts USD to CAD using exchange rate", () => {
      expect(toCAD(100, "USD", 1.39)).toBe(139);
      expect(toCAD("50", "USD", 1.39)).toBe(69.5);
    });

    it("leaves CAD unchanged", () => {
      expect(toCAD(100, "CAD", 1.39)).toBe(100);
      expect(toCAD("50", "CAD", 1.39)).toBe(50);
    });

    it("handles zero and invalid input", () => {
      expect(toCAD(0, "USD", 1.39)).toBe(0);
      expect(toCAD("", "USD", 1.39)).toBe(0);
      expect(toCAD("abc", "USD", 1.39)).toBe(0);
    });
  });

  describe("toUSD", () => {
    it("converts CAD to USD using exchange rate", () => {
      expect(toUSD(139, 1.39)).toBeCloseTo(100);
      expect(toUSD(69.5, 1.39)).toBeCloseTo(50);
    });
  });

  describe("fmt", () => {
    it("formats in CAD when displayCurrency is CAD", () => {
      const result = fmt(139, "CAD", 1.39);
      expect(result).toMatch(/CAD \$139/);
    });

    it("formats in USD when displayCurrency is USD", () => {
      const result = fmt(139, "USD", 1.39);
      expect(result).toMatch(/USD \$100/);
    });
  });

  describe("uid", () => {
    it("returns a non-empty string", () => {
      const id = uid();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns different values on each call", () => {
      const ids = new Set([uid(), uid(), uid()]);
      expect(ids.size).toBe(3);
    });
  });

  describe("emptyLeg", () => {
    it("returns a leg with required fields and uid", () => {
      const leg = emptyLeg();
      expect(leg.id).toBeDefined();
      expect(leg.origin).toBe("");
      expect(leg.destination).toBe("");
      expect(leg.airline).toBe("");
      expect(leg.flightHours).toBe(0);
      expect(leg.layoverHours).toBe(0);
      expect(leg.price).toBe("");
      expect(leg.currency).toBe("USD");
      expect(leg.notes).toBe("");
    });
  });

  describe("emptyRoute", () => {
    it("returns a route with id and two legs", () => {
      const route = emptyRoute();
      expect(route.id).toBeDefined();
      expect(route.label).toBe("");
      expect(route.legs).toHaveLength(2);
      expect(route.createdAt).toBeDefined();
      expect(route.updatedAt).toBeDefined();
    });
  });

  describe("emptyDomestic", () => {
    it("returns a domestic with required fields", () => {
      const d = emptyDomestic();
      expect(d.id).toBeDefined();
      expect(d.label).toBe("");
      expect(d.transport).toBe("Bus");
      expect(d.currency).toBe("USD");
    });
  });

  describe("routeTotalCAD", () => {
    it("sums leg prices converted to CAD", () => {
      const route: Route = {
        id: "r1",
        label: "Test",
        legs: [
          { ...emptyLeg(), id: "l1", price: "100", currency: "USD" },
          { ...emptyLeg(), id: "l2", price: "50", currency: "CAD" },
        ],
        createdAt: "",
        updatedAt: "",
      };
      expect(routeTotalCAD(route, 1.39)).toBeCloseTo(139 + 50);
    });

    it("returns 0 for route with no priced legs", () => {
      const route = emptyRoute();
      expect(routeTotalCAD(route, 1.39)).toBe(0);
    });
  });

  describe("routeTotalHours", () => {
    it("sums flight and layover hours", () => {
      const route: Route = {
        id: "r1",
        label: "Test",
        legs: [
          { ...emptyLeg(), flightHours: 3, layoverHours: 2 },
          { ...emptyLeg(), flightHours: 5, layoverHours: 0 },
        ],
        createdAt: "",
        updatedAt: "",
      };
      expect(routeTotalHours(route)).toBe(3 + 2 + 5 + 0);
    });
  });

  describe("routeStops", () => {
    it("returns legs.length - 1", () => {
      expect(routeStops({ ...emptyRoute(), legs: [emptyLeg(), emptyLeg()] })).toBe(1);
      expect(routeStops({ ...emptyRoute(), legs: [emptyLeg(), emptyLeg(), emptyLeg()] })).toBe(2);
    });

    it("returns 0 for single leg", () => {
      expect(routeStops({ ...emptyRoute(), legs: [emptyLeg()] })).toBe(0);
    });
  });

  describe("flightHoursFromTimes", () => {
    it("returns hours between departure and arrival same day", () => {
      expect(flightHoursFromTimes("08:00", "11:30")).toBe(3.5);
      expect(flightHoursFromTimes("14:00", "16:00")).toBe(2);
      expect(flightHoursFromTimes("09:00", "09:00")).toBe(0);
    });

    it("assumes next day when arrival is before departure", () => {
      expect(flightHoursFromTimes("22:00", "06:00")).toBe(8);
      expect(flightHoursFromTimes("23:30", "02:00")).toBe(2.5);
    });

    it("returns null when missing or invalid", () => {
      expect(flightHoursFromTimes("", "11:00")).toBeNull();
      expect(flightHoursFromTimes("08:00", "")).toBeNull();
      expect(flightHoursFromTimes(undefined, "11:00")).toBeNull();
      expect(flightHoursFromTimes("08:00", "invalid")).toBeNull();
    });

    it("rounds to one decimal", () => {
      expect(flightHoursFromTimes("08:00", "11:15")).toBe(3.3);
    });
  });

  describe("WEIGHTS", () => {
    it("has entries for price, comfort, time, balanced", () => {
      expect(WEIGHTS.price).toEqual({ price: 0.7, stops: 0.15, duration: 0.15 });
      expect(WEIGHTS.comfort).toEqual({ price: 0.15, stops: 0.5, duration: 0.35 });
      expect(WEIGHTS.time).toEqual({ price: 0.2, stops: 0.2, duration: 0.6 });
      expect(WEIGHTS.balanced).toEqual({ price: 0.4, stops: 0.3, duration: 0.3 });
    });
  });
});

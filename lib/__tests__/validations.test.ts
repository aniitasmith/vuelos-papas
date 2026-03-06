import { describe, it, expect } from "vitest";
import {
  legSchema,
  routeSchema,
  domesticSchema,
  settingsSchema,
} from "../validations";

describe("validations", () => {
  describe("legSchema", () => {
    it("accepts valid leg", () => {
      const leg = {
        id: "leg1",
        origin: "CCS",
        destination: "CUN",
        airline: "Copa",
        flightHours: 2.5,
        layoverHours: 1,
        price: "150",
        currency: "USD" as const,
        notes: "",
      };
      const result = legSchema.safeParse(leg);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe("150");
      }
    });

    it("transforms numeric price to string", () => {
      const result = legSchema.safeParse({
        id: "l1",
        origin: "A",
        destination: "B",
        airline: "X",
        flightHours: 1,
        layoverHours: 0,
        price: 99,
        currency: "USD",
        notes: "",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe("99");
      }
    });

    it("rejects invalid currency", () => {
      const result = legSchema.safeParse({
        id: "l1",
        origin: "A",
        destination: "B",
        airline: "X",
        flightHours: 1,
        layoverHours: 0,
        price: "10",
        currency: "EUR",
        notes: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("routeSchema", () => {
    it("accepts valid route with min 1 leg", () => {
      const route = {
        id: "r1",
        label: "Via CUN",
        legs: [
          {
            id: "l1",
            origin: "CCS",
            destination: "CUN",
            airline: "X",
            flightHours: 2,
            layoverHours: 0,
            price: "100",
            currency: "USD",
            notes: "",
          },
        ],
        domesticId: undefined,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };
      const result = routeSchema.safeParse(route);
      expect(result.success).toBe(true);
    });

    it("rejects empty legs", () => {
      const result = routeSchema.safeParse({
        id: "r1",
        label: "X",
        legs: [],
        createdAt: "",
        updatedAt: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("domesticSchema", () => {
    it("accepts valid domestic", () => {
      const d = {
        id: "d1",
        label: "Bus",
        cityOrigin: "Mérida",
        transport: "Bus" as const,
        durationHours: 5,
        price: "40",
        currency: "USD" as const,
        notes: "",
        createdAt: "",
        updatedAt: "",
      };
      const result = domesticSchema.safeParse(d);
      expect(result.success).toBe(true);
    });

    it("rejects invalid transport", () => {
      const result = domesticSchema.safeParse({
        id: "d1",
        label: "X",
        cityOrigin: "Y",
        transport: "Tren",
        durationHours: 0,
        price: "0",
        currency: "USD",
        notes: "",
        createdAt: "",
        updatedAt: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("settingsSchema", () => {
    it("accepts partial settings", () => {
      const result = settingsSchema.safeParse({
        priority: "price",
        displayCurrency: "CAD",
        exchangeRateUSDToCAD: 1.39,
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = settingsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("rejects exchange rate out of range", () => {
      const tooLow = settingsSchema.safeParse({ exchangeRateUSDToCAD: 0.05 });
      expect(tooLow.success).toBe(false);
      const tooHigh = settingsSchema.safeParse({ exchangeRateUSDToCAD: 5 });
      expect(tooHigh.success).toBe(false);
    });

    it("accepts valid priority values", () => {
      for (const p of ["price", "comfort", "time", "balanced"] as const) {
        const result = settingsSchema.safeParse({ priority: p });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid priority", () => {
      const result = settingsSchema.safeParse({ priority: "invalid" });
      expect(result.success).toBe(false);
    });
  });
});

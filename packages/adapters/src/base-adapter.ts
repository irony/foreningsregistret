import createClient from "openapi-fetch";
import { z } from "zod";
import {
  Association,
  SearchFilters,
  SearchResult,
  AdapterConfig,
  IAssociationAdapter,
} from "@foreningsregister/types";

export abstract class BaseAdapter implements IAssociationAdapter {
  public readonly config: AdapterConfig;
  protected client: ReturnType<typeof createClient>;

  constructor(config: AdapterConfig) {
    this.config = config;
    this.client = createClient({
      baseUrl: this.config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Föreningsregister-API/1.0.0",
        ...this.config.headers,
      },
    });
  }

  abstract searchAssociations(filters: SearchFilters): Promise<SearchResult>;
  abstract getAssociationById(id: string): Promise<Association | null>;
  abstract getAllAssociations(
    page?: number,
    pageSize?: number,
  ): Promise<SearchResult>;
  abstract transformData(rawData: any): Association[];

  async healthCheck(): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Default health check - try to fetch a small amount of data
      await this.getAllAssociations(1, 1);

      const responseTime = Date.now() - startTime;

      // Consider it healthy if response time is under 10 seconds
      return responseTime < 10000;
    } catch (error) {
      console.error(`Health check failed for ${this.config.name}:`, error);
      return false;
    }
  }

  protected createSearchResult(
    associations: Association[],
    total: number,
    page: number = 1,
    pageSize: number = 20,
  ): SearchResult {
    return {
      associations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  protected validateOrganizationNumber(orgNumber: string): boolean {
    // Swedish organization number validation
    const orgNumberRegex = /^\d{6}-\d{4}$/;
    if (!orgNumberRegex.test(orgNumber)) return false;

    const cleanNumber = orgNumber.replace("-", "");
    const digits = cleanNumber.split("").map((d) => parseInt(d, 10));

    // Luhn algorithm
    let sum = 0;
    for (let i = 0; i < digits.length - 1; i++) {
      let digit = digits[i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[digits.length - 1];
  }

  protected cleanString(value: any): string | undefined {
    if (typeof value !== "string") return undefined;
    return value.trim().replace(/\s+/g, " ") || undefined;
  }

  protected cleanEmail(value: any): string | undefined {
    const cleaned = this.cleanString(value);
    if (!cleaned) return undefined;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(cleaned) ? cleaned.toLowerCase() : undefined;
  }

  protected cleanPhone(value: any): string | undefined {
    if (typeof value !== "string") return undefined;

    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "");

    // Validate Swedish phone number formats
    const swedishPhoneRegex = /^(\+46|0)[1-9]\d{7,9}$/;
    return swedishPhoneRegex.test(cleaned) ? cleaned : undefined;
  }

  protected cleanUrl(value: any): string | undefined {
    const cleaned = this.cleanString(value);
    if (!cleaned) return undefined;

    // Add protocol if missing
    if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
      return `https://${cleaned}`;
    }

    try {
      new URL(cleaned);
      return cleaned;
    } catch {
      return undefined;
    }
  }
}

import { z } from "zod";
import { BaseAdapter } from "../base-adapter";
import {
  Association,
  SearchFilters,
  SearchResult,
  AdapterConfig,
} from "@foreningsregister/types";

// Göteborg API response schemas (example - adjust based on actual API)
const GoteborgAssociationSchema = z.object({
  forenings_id: z.string(),
  foreningsnamn: z.string(),
  org_nr: z.string().optional(),
  beskrivning: z.string().optional(),
  hemsida: z.string().optional(),
  e_post: z.string().optional(),
  telefon: z.string().optional(),
  postadress: z
    .object({
      utdelningsadress1: z.string().optional(),
      postnummer: z.string().optional(),
      postort: z.string().optional(),
    })
    .optional(),
  verksamhetstyp: z.string().optional(),
  underverksamhetstyp: z.string().optional(),
  status: z.string().optional(),
});

const GoteborgSearchResponseSchema = z.object({
  resultat: z.array(GoteborgAssociationSchema),
  antal_träffar: z.number(),
  sidnummer: z.number(),
  antal_per_sida: z.number(),
  totalt_antal_sidor: z.number(),
});

export class GoteborgAdapter extends BaseAdapter {
  constructor() {
    const config: AdapterConfig = {
      name: "Göteborg",
      baseUrl: "https://api.goteborg.se/foreningsregister",
      municipality: "Göteborg",
      county: "Västra Götalands län",
      rateLimit: {
        requestsPerSecond: 1,
        burstLimit: 5,
      },
    };
    super(config);
  }

  async searchAssociations(filters: SearchFilters): Promise<SearchResult> {
    try {
      const params = new URLSearchParams();

      if (filters.query) {
        params.append("sokord", filters.query);
      }

      if (filters.category) {
        params.append("verksamhetstyp", filters.category);
      }

      if (filters.isActive !== undefined) {
        params.append("status", filters.isActive ? "aktiv" : "inaktiv");
      }

      params.append("sida", (filters.page || 1).toString());
      params.append("limit", (filters.pageSize || 20).toString());

      const { data, error } = await this.client.GET("/sok", {
        params: {
          query: Object.fromEntries(params),
        },
      });

      if (error) {
        throw new Error(`Göteborg API error: ${error.message}`);
      }

      const validatedData = GoteborgSearchResponseSchema.parse(data);
      const associations = this.transformData(validatedData.resultat);

      return this.createSearchResult(
        associations,
        validatedData.antal_träffar,
        validatedData.sidnummer,
        validatedData.antal_per_sida,
      );
    } catch (error) {
      console.error("Göteborg adapter search error:", error);
      throw error;
    }
  }

  async getAssociationById(id: string): Promise<Association | null> {
    try {
      const { data, error } = await this.client.GET("/forening/{id}", {
        params: {
          path: { id },
        },
      });

      if (error) {
        if (error.status === 404) return null;
        throw new Error(`Göteborg API error: ${error.message}`);
      }

      const validatedData = GoteborgAssociationSchema.parse(data);
      const associations = this.transformData([validatedData]);

      return associations[0] || null;
    } catch (error) {
      console.error("Göteborg adapter get by id error:", error);
      throw error;
    }
  }

  async getAllAssociations(
    page: number = 1,
    pageSize: number = 20,
  ): Promise<SearchResult> {
    try {
      const { data, error } = await this.client.GET("/foreningar", {
        params: {
          query: {
            sida: page.toString(),
            limit: pageSize.toString(),
          },
        },
      });

      if (error) {
        throw new Error(`Göteborg API error: ${error.message}`);
      }

      const validatedData = GoteborgSearchResponseSchema.parse(data);
      const associations = this.transformData(validatedData.resultat);

      return this.createSearchResult(
        associations,
        validatedData.antal_träffar,
        validatedData.sidnummer,
        validatedData.antal_per_sida,
      );
    } catch (error) {
      console.error("Göteborg adapter get all error:", error);
      throw error;
    }
  }

  transformData(rawData: any[]): Association[] {
    return rawData
      .map((item) => {
        const validated = GoteborgAssociationSchema.parse(item);

        return {
          id: validated.forenings_id,
          name: this.cleanString(validated.foreningsnamn) || "",
          organizationNumber: this.cleanString(validated.org_nr) || "",
          description: this.cleanString(validated.beskrivning),
          website: this.cleanUrl(validated.hemsida),
          email: this.cleanEmail(validated.e_post),
          phone: this.cleanPhone(validated.telefon),
          address: validated.postadress
            ? {
                street: this.cleanString(
                  validated.postadress.utdelningsadress1,
                ),
                postalCode: this.cleanString(validated.postadress.postnummer),
                city:
                  this.cleanString(validated.postadress.postort) ||
                  this.config.municipality,
                country: "Sverige",
              }
            : undefined,
          category: this.cleanString(validated.verksamhetstyp),
          subCategory: this.cleanString(validated.underverksamhetstyp),
          municipality: this.config.municipality,
          county: this.config.county,
          isActive: validated.status !== "inaktiv",
          registrationDate: undefined,
          lastUpdated: new Date().toISOString(),
          contacts: [],
        };
      })
      .filter(
        (association) =>
          association.name &&
          association.organizationNumber &&
          this.validateOrganizationNumber(association.organizationNumber),
      );
  }
}

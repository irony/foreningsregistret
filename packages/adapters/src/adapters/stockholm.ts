import { z } from "zod";
import { BaseAdapter } from "../base-adapter";
import {
  Association,
  SearchFilters,
  SearchResult,
  AdapterConfig,
} from "@foreningsregister/types";

// Stockholm API response schemas (example - adjust based on actual API)
const StockholmAssociationSchema = z.object({
  id: z.string(),
  namn: z.string(),
  organisationsnummer: z.string().optional(),
  beskrivning: z.string().optional(),
  webbplats: z.string().optional(),
  epost: z.string().optional(),
  telefon: z.string().optional(),
  adress: z
    .object({
      gatuadress: z.string().optional(),
      postnummer: z.string().optional(),
      postort: z.string().optional(),
    })
    .optional(),
  kategori: z.string().optional(),
  underkategori: z.string().optional(),
  aktiv: z.boolean().optional(),
});

const StockholmSearchResponseSchema = z.object({
  foreningar: z.array(StockholmAssociationSchema),
  totaltAntal: z.number(),
  sida: z.number(),
  antalPerSida: z.number(),
});

export class StockholmAdapter extends BaseAdapter {
  constructor() {
    const config: AdapterConfig = {
      name: "Stockholm",
      baseUrl: "https://api.stockholm.se/foreningsregister",
      municipality: "Stockholm",
      county: "Stockholms län",
      rateLimit: {
        requestsPerSecond: 2,
        burstLimit: 10,
      },
    };
    super(config);
  }

  async searchAssociations(filters: SearchFilters): Promise<SearchResult> {
    try {
      const params = new URLSearchParams();

      if (filters.query) {
        params.append("sok", filters.query);
      }

      if (filters.category) {
        params.append("kategori", filters.category);
      }

      if (filters.isActive !== undefined) {
        params.append("aktiv", filters.isActive.toString());
      }

      params.append("sida", (filters.page || 1).toString());
      params.append("antalPerSida", (filters.pageSize || 20).toString());

      const { data, error } = await this.client.GET("/search", {
        params: {
          query: Object.fromEntries(params),
        },
      });

      if (error) {
        throw new Error(`Stockholm API error: ${error.message}`);
      }

      const validatedData = StockholmSearchResponseSchema.parse(data);
      const associations = this.transformData(validatedData.foreningar);

      return this.createSearchResult(
        associations,
        validatedData.totaltAntal,
        validatedData.sida,
        validatedData.antalPerSida,
      );
    } catch (error) {
      console.error("Stockholm adapter search error:", error);
      throw error;
    }
  }

  async getAssociationById(id: string): Promise<Association | null> {
    try {
      const { data, error } = await this.client.GET("/foreningar/{id}", {
        params: {
          path: { id },
        },
      });

      if (error) {
        if (error.status === 404) return null;
        throw new Error(`Stockholm API error: ${error.message}`);
      }

      const validatedData = StockholmAssociationSchema.parse(data);
      const associations = this.transformData([validatedData]);

      return associations[0] || null;
    } catch (error) {
      console.error("Stockholm adapter get by id error:", error);
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
            antalPerSida: pageSize.toString(),
          },
        },
      });

      if (error) {
        throw new Error(`Stockholm API error: ${error.message}`);
      }

      const validatedData = StockholmSearchResponseSchema.parse(data);
      const associations = this.transformData(validatedData.foreningar);

      return this.createSearchResult(
        associations,
        validatedData.totaltAntal,
        validatedData.sida,
        validatedData.antalPerSida,
      );
    } catch (error) {
      console.error("Stockholm adapter get all error:", error);
      throw error;
    }
  }

  transformData(rawData: any[]): Association[] {
    return rawData
      .map((item) => {
        const validated = StockholmAssociationSchema.parse(item);

        return {
          id: validated.id,
          name: this.cleanString(validated.namn) || "",
          organizationNumber:
            this.cleanString(validated.organisationsnummer) || "",
          description: this.cleanString(validated.beskrivning),
          website: this.cleanUrl(validated.webbplats),
          email: this.cleanEmail(validated.epost),
          phone: this.cleanPhone(validated.telefon),
          address: validated.adress
            ? {
                street: this.cleanString(validated.adress.gatuadress),
                postalCode: this.cleanString(validated.adress.postnummer),
                city:
                  this.cleanString(validated.adress.postort) ||
                  this.config.municipality,
                country: "Sverige",
              }
            : undefined,
          category: this.cleanString(validated.kategori),
          subCategory: this.cleanString(validated.underkategori),
          municipality: this.config.municipality,
          county: this.config.county,
          isActive: validated.aktiv ?? true,
          registrationDate: undefined, // Stockholm API might not provide this
          lastUpdated: new Date().toISOString(),
          contacts: [], // Could be parsed from description or other fields if available
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

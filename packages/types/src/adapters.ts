import { z } from 'zod'
import { Association } from './association'

// Adapter-konfiguration
export const AdapterConfigSchema = z.object({
  name: z.string(),
  baseUrl: z.string().url(),
  municipality: z.string(),
  county: z.string(),
  apiKey: z.string().optional(),
  headers: z.record(z.string()).optional(),
  rateLimit: z
    .object({
      requestsPerSecond: z.number().default(1),
      burstLimit: z.number().default(10),
    })
    .optional(),
})

export type AdapterConfig = z.infer<typeof AdapterConfigSchema>

// Adapter-gränssnitt
export interface IAssociationAdapter {
  readonly config: AdapterConfig

  // Grundläggande operationer
  searchAssociations(filters: any): Promise<any>
  getAssociationById(id: string): Promise<Association | null>

  // Hämta alla (med paginering)
  getAllAssociations(page?: number, pageSize?: number): Promise<any>

  // Health check
  healthCheck(): Promise<boolean>

  // Transformera data till standardformat
  transformData(rawData: any): Association[]
}

// Adapter-resultat
export const AdapterResultSchema = z.object({
  success: z.boolean(),
  data: z.array(z.unknown()).optional(),
  error: z.string().optional(),
  metadata: z.object({
    adapter: z.string(),
    totalItems: z.number(),
    processingTime: z.number(),
    timestamp: z.string().datetime(),
  }),
})

export type AdapterResult = z.infer<typeof AdapterResultSchema>

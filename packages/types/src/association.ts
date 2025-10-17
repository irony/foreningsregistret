import { z } from 'zod'

// Grundläggande föreningsinformation som är gemensam för alla register
export const AssociationSchema = z.object({
  id: z.string(),
  name: z.string(),
  organizationNumber: z
    .string()
    .regex(/^\d{6}-\d{4}$/, 'Ogiltigt organisationsnummer'),
  description: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Adressinformation
  address: z
    .object({
      street: z.string().optional(),
      postalCode: z
        .string()
        .regex(/^\d{3} \d{2}$/, 'Ogiltigt postnummer')
        .optional(),
      city: z.string().optional(),
      country: z.string().default('Sverige'),
    })
    .optional(),

  // Kategorisering
  category: z.string().optional(),
  subCategory: z.string().optional(),

  // Metadata
  municipality: z.string(),
  county: z.string(),
  isActive: z.boolean().default(true),
  registrationDate: z.string().datetime().optional(),
  lastUpdated: z.string().datetime().optional(),

  // Kontakt personer
  contacts: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .optional(),
})

export type Association = z.infer<typeof AssociationSchema>

// Sökkriterier
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  municipality: z.string().optional(),
  county: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type SearchFilters = z.infer<typeof SearchFiltersSchema>

// Sökresultat
export const SearchResultSchema = z.object({
  associations: z.array(AssociationSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export type SearchResult = z.infer<typeof SearchResultSchema>

// API-svar
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  metadata: z
    .object({
      source: z.string(),
      timestamp: z.string().datetime(),
      version: z.string(),
    })
    .optional(),
})

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data?: T
}

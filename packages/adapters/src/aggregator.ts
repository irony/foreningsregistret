import {
  Association,
  SearchFilters,
  SearchResult,
  IAssociationAdapter,
} from '@foreningsregister/types'
import { adapterRegistry } from './adapter-registry'

export class AssociationAggregator {
  private registry = adapterRegistry

  async searchAcrossMunicipalities(
    filters: SearchFilters,
    municipalities?: string[]
  ): Promise<SearchResult> {
    const adapters = this.getAdaptersForSearch(municipalities)

    if (adapters.length === 0) {
      return {
        associations: [],
        total: 0,
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
        totalPages: 0,
      }
    }

    try {
      // Search across all selected adapters in parallel
      const searchPromises = adapters.map(adapter =>
        this.searchWithFallback(adapter, filters)
      )

      const results = await Promise.allSettled(searchPromises)

      // Aggregate successful results
      const allAssociations: Association[] = []
      let totalResults = 0

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allAssociations.push(...result.value.associations)
          totalResults += result.value.total
        } else if (result.status === 'rejected') {
          console.error('Adapter search failed:', result.reason)
        }
      })

      // Sort and paginate the aggregated results
      const sortedAssociations = this.sortAssociations(allAssociations, filters)
      const pageSize = filters.pageSize || 20
      const page = filters.page || 1
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedAssociations = sortedAssociations.slice(
        startIndex,
        endIndex
      )

      return {
        associations: paginatedAssociations,
        total: totalResults,
        page,
        pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
      }
    } catch (error) {
      console.error('Aggregated search failed:', error)
      throw error
    }
  }

  async getAssociationById(id: string): Promise<Association | null> {
    const adapters = this.registry.getAll()

    // Try each adapter until we find the association
    for (const adapter of adapters) {
      try {
        const association = await adapter.getAssociationById(id)
        if (association) return association
      } catch (error) {
        console.error(
          `Failed to get association ${id} from ${adapter.config.name}:`,
          error
        )
        continue
      }
    }

    return null
  }

  async getAllAssociations(
    page: number = 1,
    pageSize: number = 20,
    municipalities?: string[]
  ): Promise<SearchResult> {
    const adapters = this.getAdaptersForSearch(municipalities)

    if (adapters.length === 0) {
      return {
        associations: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      }
    }

    try {
      const getAllPromises = adapters.map(adapter =>
        this.getAllWithFallback(adapter, page, pageSize)
      )

      const results = await Promise.allSettled(getAllPromises)

      const allAssociations: Association[] = []
      let totalResults = 0

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allAssociations.push(...result.value.associations)
          totalResults += result.value.total
        } else if (result.status === 'rejected') {
          console.error('Adapter get all failed:', result.reason)
        }
      })

      const sortedAssociations = this.sortAssociations(allAssociations)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedAssociations = sortedAssociations.slice(
        startIndex,
        endIndex
      )

      return {
        associations: paginatedAssociations,
        total: totalResults,
        page,
        pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
      }
    } catch (error) {
      console.error('Aggregated get all failed:', error)
      throw error
    }
  }

  async getStatistics(): Promise<{
    totalAssociations: number
    totalMunicipalities: number
    municipalities: Array<{
      name: string
      count: number
      healthy: boolean
    }>
    categories: Array<{
      name: string
      count: number
    }>
  }> {
    const adapters = this.registry.getAll()
    const healthStatus = await this.registry.healthCheckAll()

    const municipalityStats = await Promise.all(
      adapters.map(async adapter => {
        try {
          const result = await adapter.getAllAssociations(1, 1) // Just get count
          return {
            name: adapter.config.municipality,
            count: result.total,
            healthy:
              healthStatus[adapter.config.municipality.toLowerCase()] || false,
          }
        } catch (error) {
          return {
            name: adapter.config.municipality,
            count: 0,
            healthy: false,
          }
        }
      })
    )

    const totalAssociations = municipalityStats.reduce(
      (sum, stat) => sum + stat.count,
      0
    )

    // TODO: Implement category aggregation
    const categories: Array<{ name: string; count: number }> = []

    return {
      totalAssociations,
      totalMunicipalities: adapters.length,
      municipalities: municipalityStats,
      categories,
    }
  }

  private getAdaptersForSearch(
    municipalities?: string[]
  ): IAssociationAdapter[] {
    if (!municipalities || municipalities.length === 0) {
      return this.registry.getHealthyAdapters()
    }

    return municipalities
      .map(municipality => this.registry.get(municipality))
      .filter(
        (adapter): adapter is IAssociationAdapter => adapter !== undefined
      )
  }

  private async searchWithFallback(
    adapter: IAssociationAdapter,
    filters: SearchFilters
  ): Promise<SearchResult | null> {
    try {
      return await adapter.searchAssociations(filters)
    } catch (error) {
      console.error(`Search failed for ${adapter.config.name}:`, error)
      return null
    }
  }

  private async getAllWithFallback(
    adapter: IAssociationAdapter,
    page: number,
    pageSize: number
  ): Promise<SearchResult | null> {
    try {
      return await adapter.getAllAssociations(page, pageSize)
    } catch (error) {
      console.error(`Get all failed for ${adapter.config.name}:`, error)
      return null
    }
  }

  private sortAssociations(
    associations: Association[],
    filters?: SearchFilters
  ): Association[] {
    const sorted = [...associations]

    // Default sort: by name, then by municipality
    sorted.sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name, 'sv')
      if (nameCompare !== 0) return nameCompare

      return a.municipality.localeCompare(b.municipality, 'sv')
    })

    // TODO: Add more sophisticated sorting based on filters
    // - Relevance for text search
    // - Geographic proximity
    // - Category matching

    return sorted
  }
}

export const associationAggregator = new AssociationAggregator()

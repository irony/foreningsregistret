import { IAssociationAdapter, AdapterConfig } from '@foreningsregister/types'
import { StockholmAdapter } from './adapters/stockholm'
import { GoteborgAdapter } from './adapters/goteborg'

export class AdapterRegistry {
  private adapters: Map<string, IAssociationAdapter> = new Map()

  constructor() {
    this.registerDefaultAdapters()
  }

  private registerDefaultAdapters(): void {
    // Register known adapters
    this.register('stockholm', new StockholmAdapter())
    this.register('goteborg', new GoteborgAdapter())

    // TODO: Add more adapters as they are implemented
    // this.register('malmo', new MalmoAdapter());
    // this.register('uppsala', new UppsalaAdapter());
    // etc.
  }

  register(municipality: string, adapter: IAssociationAdapter): void {
    this.adapters.set(municipality.toLowerCase(), adapter)
  }

  get(municipality: string): IAssociationAdapter | undefined {
    return this.adapters.get(municipality.toLowerCase())
  }

  getAll(): IAssociationAdapter[] {
    return Array.from(this.adapters.values())
  }

  getMunicipalities(): string[] {
    return Array.from(this.adapters.keys())
  }

  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    const promises = Array.from(this.adapters.entries()).map(
      async ([municipality, adapter]) => {
        try {
          results[municipality] = await adapter.healthCheck()
        } catch (error) {
          console.error(`Health check failed for ${municipality}:`, error)
          results[municipality] = false
        }
      }
    )

    await Promise.all(promises)
    return results
  }

  getHealthyAdapters(): IAssociationAdapter[] {
    // TODO: Implement health status tracking
    return this.getAll()
  }

  getAdapterByCounty(county: string): IAssociationAdapter[] {
    return this.getAll().filter(
      adapter => adapter.config.county.toLowerCase() === county.toLowerCase()
    )
  }
}

// Singleton instance
export const adapterRegistry = new AdapterRegistry()

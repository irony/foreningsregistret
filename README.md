# Föreningsregister Monorepo

Ett monorepo för att samla och presentera data från svenska kommunala föreningsregister.

## Arkitektur

Projektet följer en bottom-up schema:

- **Database** → **OpenAPI** → **Generated Types**
- **API** → **UI** → **Components**

### Struktur

```
foreningsregister-monorepo/
├── apps/
│   ├── api/          # Hono API-server med OpenAPI
│   └── frontend/     # React + Vite frontend
├── packages/
│   ├── types/        # Delade typer och Zod-scheman
│   ├── adapters/     # Adapters för olika kommuners API:er
│   └── shared/       # Delade verktyg och konstanter
└── turbo.json        # Turbo-konfiguration
```

## Teknikstack

### Backend (API)

- **Hono** - Lättviktig webbramverk
- **OpenAPI** - API-dokumentation och types
- **Zod** - Runtime-validering och TypeScript-generering
- **openapi-fetch** - Typsäkra API-anrop

### Frontend

- **React 18** - UI-ramverk
- **TypeScript** - Typsäkerhet
- **Vite** - Byggverktyg
- **Tailwind CSS** - Styling
- **React Query** - Datahämtning och cache
- **React Router** - Routing

### Adapters

- **Adapter Pattern** - För olika kommuners API:er
- **Zod Schemas** - Datatransformation och validering
- **Rate Limiting** - Respekt för API-begränsningar

## Komma igång

### Förutsättningar

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Installera dependencies
pnpm install

# Bygg alla paket
pnpm build
```

### Utveckling

```bash
# Starta alla tjänster i development-läge
pnpm dev

# Starta endast API:et
pnpm --filter @foreningsregister/api dev

# Starta endast frontend
pnpm --filter @foreningsregister/frontend dev
```

### Byggnation

```bash
# Bygg allt
pnpm build

# Bygg specifik app
pnpm --filter @foreningsregister/api build
pnpm --filter @foreningsregister/frontend build
```

## API:er

### Nuvarande adapters

- **Stockholm** - Stockholms stads föreningsregister
- **Göteborg** - Göteborgs stads föreningsregister

### Lägga till ny adapter

1. Skapa ny adapter-klass i `packages/adapters/src/adapters/`
2. Ärva från `BaseAdapter`
3. Implementera nödvändiga metoder:
   - `searchAssociations()`
   - `getAssociationById()`
   - `getAllAssociations()`
   - `transformData()`

4. Registrera i `AdapterRegistry`
5. Lägg till Zod-schema för API-svaret

Exempel:

```typescript
export class NewMunicipalityAdapter extends BaseAdapter {
  constructor() {
    const config: AdapterConfig = {
      name: 'Nyköping',
      baseUrl: 'https://api.nykoping.se/foreningar',
      municipality: 'Nyköping',
      county: 'Södermanlands län',
    }
    super(config)
  }

  // Implementera metoder...
}
```

## API-endpoints

### GET /api/health

Health check för API:et.

### GET /api/associations/search

Sök föreningar med filter.

Query parametrar:

- `query` - Sökord
- `municipality` - Kommune
- `county` - Län
- `category` - Kategori
- `isActive` - Aktiv status
- `page` - Sidnummer (default: 1)
- `pageSize` - Resultat per sida (default: 20, max: 100)

### GET /api/associations/{id}

Hämta specifik förening.

### GET /api/associations

Hämta alla föreningar (med paginering).

## Datamodell

All data valideras med Zod-scheman för att säkerställa konsistens:

```typescript
interface Association {
  id: string
  name: string
  organizationNumber: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    postalCode?: string
    city?: string
    country: string
  }
  category?: string
  subCategory?: string
  municipality: string
  county: string
  isActive: boolean
  registrationDate?: string
  lastUpdated?: string
  contacts?: Array<{
    name: string
    role: string
    email?: string
    phone?: string
  }>
}
```

## Contributing

1. Forka repo
2. Skapa feature branch: `git checkout -b feature/amazing-feature`
3. Commita ändringar: `git commit -m 'Add amazing feature'`
4. Pusha: `git push origin feature/amazing-feature`
5. Öppna Pull Request

## Licens

MIT License - se LICENSE-filen för detaljer.

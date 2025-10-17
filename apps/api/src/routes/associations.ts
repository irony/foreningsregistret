import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from 'zod'
import {
  AssociationSchema,
  SearchFiltersSchema,
  SearchResultSchema,
  ApiResponseSchema,
} from '@foreningsregister/types'

const app = new OpenAPIHono()

// Sökföreningar
const searchRoute = createRoute({
  method: 'get',
  path: '/search',
  request: {
    query: SearchFiltersSchema.extend({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(20),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ApiResponseSchema.extend({
            data: SearchResultSchema,
          }),
        },
      },
      description: 'Sökresultat för föreningar',
    },
    400: {
      content: {
        'application/json': {
          schema: ApiResponseSchema,
        },
      },
      description: 'Bad request',
    },
  },
})

app.openapi(searchRoute, async c => {
  try {
    const filters = c.req.valid('query')

    // TODO: Implementera söklogik med adaptrar
    const mockResult = {
      associations: [],
      total: 0,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: 0,
    }

    return c.json({
      success: true,
      data: mockResult,
      metadata: {
        source: 'aggregated',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    })
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      400
    )
  }
})

// Hämta specifik förening
const getByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ApiResponseSchema.extend({
            data: AssociationSchema,
          }),
        },
      },
      description: 'Föreningsinformation',
    },
    404: {
      content: {
        'application/json': {
          schema: ApiResponseSchema,
        },
      },
      description: 'Förening hittades inte',
    },
  },
})

app.openapi(getByIdRoute, async c => {
  try {
    const { id } = c.req.valid('params')

    // TODO: Implementera hämtning med adaptrar
    return c.json(
      {
        success: false,
        error: 'Association not found',
      },
      404
    )
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// Hämta alla föreningar (med paginering)
const getAllRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(20),
      municipality: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ApiResponseSchema.extend({
            data: SearchResultSchema,
          }),
        },
      },
      description: 'Lista över föreningar',
    },
  },
})

app.openapi(getAllRoute, async c => {
  try {
    const { page, pageSize, municipality } = c.req.valid('query')

    // TODO: Implementera hämtning med adaptrar
    const mockResult = {
      associations: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    }

    return c.json({
      success: true,
      data: mockResult,
      metadata: {
        source: 'aggregated',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    })
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

export default app

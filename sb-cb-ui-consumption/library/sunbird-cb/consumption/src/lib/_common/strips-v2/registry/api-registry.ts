import { ApiMethod, ApiRegistryConfig } from "../models/content-section.model"

export const API_REGISTRY: ApiRegistryConfig = {
  popularCoursesApi: {
    endpoint: '/api/content/v1/popular-courses',
    method: ApiMethod.Get,
    queryParams: { limit: '10' }
  },
  caProgramBeginnerApi: {
    endpoint: '/api/content/v1/ca-program',
    method: ApiMethod.Post,
    body: { level: 'beginner' }
  },
  caProgramAdvancedApi: {
    endpoint: '/api/content/v1/ca-program',
    method: ApiMethod.Post,
    body: { level: 'advanced' }
  },
  spotlightApi: {
    endpoint: '/api/content/v1/spotlight',
    method: ApiMethod.Get
  },
  trendingAllApi: {
    endpoint: '/api/content/v1/trending',
    method: ApiMethod.Get,
    queryParams: { category: 'all' }
  },
  trendingCyberApi: {
    endpoint: '/api/content/v1/trending',
    method: ApiMethod.Get,
    queryParams: { category: 'cyber' }
  }
}

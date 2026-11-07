import { createClient } from '@sanity/client'

const token = process.env['SANITY_READ_TOKEN']

export const sanity = createClient({
  projectId: process.env['SANITY_PROJECT_ID']!,
  dataset: process.env['SANITY_DATASET'] || 'production',
  apiVersion: process.env['SANITY_API_VERSION'] || '2025-01-01',
  ...(token ? { token } : {}),
  useCdn: false, // private dataset: always hit the API
  perspective: 'published',
})
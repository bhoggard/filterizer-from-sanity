import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ng5yto4p',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
})

export async function getVenuesGroupedByNeighborhood() {
  const today = new Date().toISOString()
  return await client.fetch(
    `
    *[_type == "neighborhood"] {
      _id,
      name,
      "venues": *[_type == "venue" && references(^._id)] | order(name asc) {
        _id,
        name,
        address,
        website,
        "events": *[_type == "event" && references(^._id) && startDate <= $today && endDate >= $today] | order(endDate asc) {
          _id,
          name,
          endDate,
          website
        }
      }
    }
  `,
    { today },
  )
}


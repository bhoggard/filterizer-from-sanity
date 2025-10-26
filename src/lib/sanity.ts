import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ng5yto4p',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
})

export async function getVenuesGroupedByNeighborhood() {
  // Get current date in New York timezone as YYYY-MM-DD
  const nyDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  return await client.fetch(
    `
    *[_type == "neighborhood"] | order(name asc) {
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
    { today: nyDate },
  )
}


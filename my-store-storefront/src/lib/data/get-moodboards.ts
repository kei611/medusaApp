// src/lib/data/get-moodboards.ts
import { sanityClient } from "@lib/sanity/client"

export async function getMoodboards() {
  const query = `*[_type == "moodboard"]{
    _id,
    title,
    description,
    zettels[]->{
      _id,
      title,
      content,
      related[]->{
        _id,
        title
      }
    }
  }`

  return await sanityClient.fetch(query)
}

import { sanityClient } from "@lib/sanity/client"

export async function getZettels() {
  const query = `*[_type == "zettel"]{
    _id,
    title,
    related[]->{
      _id,
      title
    }
  }`
  return await sanityClient.fetch(query)
}

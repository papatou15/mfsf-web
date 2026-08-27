import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    // Regeneration must read the latest published content from Sanity.
    useCdn: false,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_APIVERSION!
})

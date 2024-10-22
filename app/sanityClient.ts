import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    // projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    // dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    // useCdn: true,
    // apiVersion: process.env.NEXT_PUBLIC_SANITY_APIVERSION,
    // token: process.env.SANITY_SECRET_TOKEN
    projectId: 'm2q9id0y',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
    token: 'ske1N5qaPqQPr3kwTu9XAOlAdpigJCX7DccJ7odfQgiMYgLEjS5Hb0GAOGSWE1Aqxptez5INVKJAHpufQ7lVmGcmEhoJoFnYkDEzSYXFXMjiIeHMnSmC4UnCBZNFiyFA6CcfvoSr8qdskXIl03LJ9daCw6rDJ4fJ9jUo2a3czLpRUELUvZq7'
})
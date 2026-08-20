import "server-only";

import { createClient } from "@sanity/client";

export function getSanityServerClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECTID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_APIVERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error("The server-side Sanity configuration is incomplete.");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

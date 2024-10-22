import { sanityClient } from "./sanityClient";

export const contactQuery = `
    *[_type == "contact"][0]{
        adress,
        telephone,
        email
    }`

export const tabsQuery = `
    *[_type == "pageMaker"]{
        _id,
        title
    }`

export const homePageQuery = `
    *[_type == 'pageMaker' && title == "Accueil"]{
        title,
        sections
    }
`


export async function queryFetcher(query: string) {
    const data = await sanityClient.fetch(query)

    return data
}
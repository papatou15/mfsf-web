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
        title,
        slug
    }`

export const homePageQuery = `
    *[_type == 'pageMaker' && title == "Accueil"][0]{
        title,
        sections[]{
          ...,
          items[]{
            ...,
          },
          "imageUrl": image.asset->url
        }
    }
`

export const servicesPagesQuery = `
    *[_type == 'pageMaker' && title == "Services"][0]{
        title,
        sections[]{
        ...,
        items[]{
            ...,
        },
        "imageUrl": image.asset->url
        }
    }

`

export const menuQuery = `
    *[_type == "menu"]{
        pages[]->{
            title,
            slug{
                current
            }
        }
    }

`

export async function queryFetcher(query: string) {
    const data = await sanityClient.fetch(query)

    return data
}
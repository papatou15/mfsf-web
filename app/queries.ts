/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityClient } from "./sanityClient";

export const headerLogoQuery = `
    *[_type == "contact"][0]{
        headerLogo
    }
`

export const footerLogoQuery = `
    *[_type == "contact"][0]{
        footerLogo
    }
`

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
            "imageUrl": image.asset->url,
            "form": form->
        }
    }

`

export const accountPageQuery = `
    *[_type == 'inscription' && !(_id in path("drafts.**")) && email == $email && (nom match $nom || nom_famille match $nom_famille)]{
    _id,
    nom,
    nom_famille,
    email,
    linkedActivities[]{
      date,
      activityId->{
        nom
      }
    },
    member_check
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

export const bannerQuery = `
    *[_type == 'banner']{
        bannerList[]{
            banner,
            textContent,
            isActive,
            bannerBgImage,
            bgColor,
            link
        },
        _type
    }
`

export const aboutPageQuery = `
    *[_type in ["teamMember", "adminTeamMember", "missionImage", "temoignages"]]{
        _type,
        _id,
        _type == "teamMember" => {
            employees[]{
                ...
            }
        },
        _type == "adminTeamMember" => {
            members[]{
                _type,
                _key,
                name,
                role,
            }
        },
        _type == "missionImage" => {
            image{
                ...,
                asset->{
                    ...,
                    altText
                }
            },
            missionText
        },
        _type == "temoignages" => {
            temoignages
        }[0...2]
    }
`

export const memberActivitiesQuery = `
    *[_type == "activity" && dates[].members[]._ref == $memberId]
`

export const cardLinkQuery = `
    *[_type == "pageMaker" && _id == $pageId]{
        slug,
        title
    }
`

export async function queryFetcher(query: string) {
    const data = await sanityClient.fetch(query)

    return data
}

export async function accountActivitiesFetcher(query: string, params: { memberId: string }) {
    const data = await sanityClient.fetch(query, params)

    return data
}

export async function memberQueryFetcher(query: string, params: { email: string, nom: string, nom_famille: string }) {
    const data = await sanityClient.fetch(query, params)

    return data
}

export async function cardLinkQueryFetcher(query: string, params: { pageId: string }) {
    const data = await sanityClient.fetch(query, params)

    return data
}

export async function formFetcher(query: string, params: Record<string, any> = {}) {
    try {
      const result = await sanityClient.fetch(query, params);
      return result;
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);
      throw error;
    }
}

export async function resolveButtonLink(card: { isPage?: boolean; link?: string; page?: { _ref: string } }) {
    if (card.isPage && card.page?._ref) {
        const result = await cardLinkQueryFetcher(cardLinkQuery, { pageId: card.page._ref });
        return result?.[0]?.slug?.current || null;
    }
    return card.link || null;
}
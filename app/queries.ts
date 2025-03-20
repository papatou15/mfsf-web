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
        "imageUrl": image.asset->url
        }
    }

`

export const accountPageQuery = `
    *[_type == 'inscription' && !(_id in path("drafts.**")) && email == $email && (nom match $nom || nom_famille match $nom_famille)]{
    _id,
    nom,
    nom_famille,
    email,
    enrolledActivities,
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
        }
    }
`

export async function queryFetcher(query: string) {
    const data = await sanityClient.fetch(query)

    return data
}

export async function memberQueryFetcher(query: string, params: { email: string, nom: string, nom_famille: string }) {
    const data = await sanityClient.fetch(query, params)

    return data
}
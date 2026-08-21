/* eslint-disable @next/next/no-img-element */

import sanityImgUrl from '../sanityImageBuilder'
import Typography from './Typography/Typography'
import typographyTheme from './theme/Typography'

type ActivityBlockProps = {
  activite?: {
    _id?: string
    nom?: string
    publicCible?: string
    description?: string
    horaire?: string
    cout?: string
    informationsComplementaires?: string
    image?: {
      asset?: {_ref?: string}
      alt?: string
    }
    dates?: Array<{
      date?: string
      isVisible?: boolean
    }>
  }
}

function TextSection({title, children}: {title: string; children?: string}) {
  if (!children) return null

  return (
    <div>
      <Typography as="h3" className={typographyTheme({size: 'h5'})}>
        {title}
      </Typography>
      <Typography
        as="p"
        className={`${typographyTheme({size: 'paragraph'})} whitespace-pre-line`}
      >
        {children}
      </Typography>
    </div>
  )
}

export default function ActivityBlock({activite}: ActivityBlockProps) {
  if (!activite) return null

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const visibleDates =
    activite.dates?.filter(
      (entry) =>
        entry.isVisible &&
        entry.date &&
        new Date(`${entry.date}T00:00:00Z`).getTime() >= today.getTime(),
    ) ?? []
  const imageUrl = activite.image?.asset
    ? sanityImgUrl(activite.image)
        .width(1000)
        .height(700)
        .fit('crop')
        .crop('focalpoint')
        .auto('format')
        .url()
    : null

  return (
    <article className="mx-auto my-10 grid w-[90%] max-w-6xl gap-8 overflow-hidden rounded-3xl bg-[#F9EFE3] p-6 shadow-lg md:grid-cols-2 md:p-10">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={activite.image?.alt || ''}
          className="h-full max-h-[560px] w-full rounded-2xl object-cover"
        />
      ) : null}

      <div className={`flex flex-col gap-6 ${imageUrl ? '' : 'md:col-span-2'}`}>
        <Typography as="h2" className={typographyTheme({size: 'h3'})}>
          {activite.nom}
        </Typography>

        <TextSection title="Pour qui ?">{activite.publicCible}</TextSection>
        <TextSection title="C’est quoi ?">{activite.description}</TextSection>
        <TextSection title="C’est quand ?">{activite.horaire}</TextSection>

        {visibleDates.length > 0 ? (
          <div>
            <Typography as="h3" className={typographyTheme({size: 'h5'})}>
              Dates proposées
            </Typography>
            <ul className="list-disc pl-6">
              {visibleDates.map((entry) => (
                <li key={entry.date}>
                  {new Intl.DateTimeFormat('fr-CA', {
                    dateStyle: 'long',
                    timeZone: 'UTC',
                  }).format(new Date(`${entry.date}T00:00:00Z`))}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <TextSection title="Coût">{activite.cout}</TextSection>
        <TextSection title="Informations complémentaires">
          {activite.informationsComplementaires}
        </TextSection>
      </div>
    </article>
  )
}

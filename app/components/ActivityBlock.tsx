/* eslint-disable @next/next/no-img-element */
"use client"

import {useState} from 'react'
import {HiChevronDown} from 'react-icons/hi'
import type {Card} from '@/sanity.types'
import sanityImgUrl from '../sanityImageBuilder'
import MFButton from './MFButton'
import Modal from './Modal'
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
    image?: NonNullable<Card['image']> & {
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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const cardImageUrl = activite.image?.asset
    ? sanityImgUrl(activite.image)
        .width(900)
        .height(450)
        .fit('crop')
        .crop('focalpoint')
        .auto('format')
        .url()
    : null

  return (
    <>
      <article
        style={{borderColor: '#20453E'}}
        className="relative col-start-1 row-start-1 grid h-[200px] w-full grid-cols-1 overflow-hidden rounded-3xl border-4"
      >
        <div
          className="absolute z-10 h-full w-full"
          style={{background: 'linear-gradient(to right, #20453E, 80%, transparent)'}}
        />
        <div className="z-20 col-start-1 row-start-1 flex w-3/5 flex-col justify-center pl-5 text-off-white sm:pl-8">
          <Typography as="h3" className={`${typographyTheme({size: 'h4'})} shadow-text-sm`}>
            {activite.nom}
          </Typography>
          <div>
            <MFButton
              _type="button"
              type="button"
              style="smallbg"
              extraCSS="my-4 mx-0 z-20"
              onClick={() => setIsModalOpen(true)}
            >
              <Typography as="p" className="flex items-center justify-center">
                Voir plus
                <HiChevronDown aria-hidden="true" />
              </Typography>
            </MFButton>
          </div>
        </div>
        <div className="z-0 col-start-1 row-start-1 h-full bg-accent-1">
          {cardImageUrl ? (
            <img
              src={cardImageUrl}
              alt={activite.image?.alt || ''}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </article>

      <Modal
        _type="card"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activite.nom}
        image={activite.image}
        type="regular"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6 py-8 sm:py-10">
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
      </Modal>
    </>
  )
}

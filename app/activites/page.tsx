import SectionRenderer, {SectionProps} from '../components/SectionRenderer'
import {activitiesPageQuery, queryFetcher} from '../queries'
import type {ReactNode} from 'react'

interface ActivitiesPageData {
  sections?: SectionProps[]
}

export default async function ActivitiesPage() {
  const activitiesPage: ActivitiesPageData | null = await queryFetcher(activitiesPageQuery)
  const renderedSections: ReactNode[] = []
  let activityGroup: SectionProps[] = []

  const flushActivities = () => {
    if (activityGroup.length === 0) return

    renderedSections.push(
      <div
        key={`activities-${renderedSections.length}`}
        className="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-2"
      >
        {activityGroup.map((section) => (
          <SectionRenderer key={section._key} section={section} {...section} />
        ))}
      </div>,
    )
    activityGroup = []
  }

  activitiesPage?.sections?.forEach((section) => {
    if (section._type === 'activityBlock') {
      activityGroup.push(section)
      return
    }

    flushActivities()
    renderedSections.push(
      <SectionRenderer key={section._key} section={section} {...section} />,
    )
  })
  flushActivities()

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-8 sm:px-8 lg:gap-8 lg:px-12 lg:py-12 xl:px-16">
      {renderedSections}
    </div>
  )
}

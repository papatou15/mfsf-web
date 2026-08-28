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
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-12 xl:px-16"
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
    <div>{renderedSections}</div>
  )
}

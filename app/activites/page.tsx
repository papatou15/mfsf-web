import SectionRenderer, {SectionProps} from '../components/SectionRenderer'
import {activitiesPageQuery, queryFetcher} from '../queries'

interface ActivitiesPageData {
  sections?: SectionProps[]
}

export default async function ActivitiesPage() {
  const activitiesPage: ActivitiesPageData | null = await queryFetcher(activitiesPageQuery)

  return (
    <div>
      {activitiesPage?.sections?.map((section) => (
        <SectionRenderer key={section._key} section={section} {...section} />
      ))}
    </div>
  )
}

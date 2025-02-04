import { queryFetcher, homePageQuery } from "./queries";
import SectionRenderer from "./components/SectionRenderer";

export default async function Home() {
    const homepage = await queryFetcher(homePageQuery)

    return (
        <div>
            {homepage.sections.map((section) => (
                <SectionRenderer key={section._key} section={section} {...section} />
            ))}
        </div>
    );
}

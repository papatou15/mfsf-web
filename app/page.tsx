import { queryFetcher, homePageQuery } from "./queries";
import SectionRenderer from "./components/SectionRenderer";

interface Section {
    _key: string;
    _type: 'heroSection' | 'card' | 'carousel' | 'stackBlock' | 'textOnPicture' | 'hero' | 'button';
}

interface Homepage {
    sections: Section[];
}

export default async function Home() {
    const homepage: Homepage = await queryFetcher(homePageQuery)

    console.log(homepage.sections.map((section) => section.items));

    return (
        <div>
            {homepage.sections.map((section) => (
                <SectionRenderer key={section._key} section={section} {...section} />
            ))}
        </div>
    );
}

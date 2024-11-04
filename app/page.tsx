import Footer from "./components/Footer";
import Header from "./components/Header";
import MFHero from "./components/MFHero";
import { queryFetcher, contactQuery, tabsQuery, homePageQuery, heroSectionHomepageQuery } from "./queries";

export default async function Home() {
    const contacts = await queryFetcher(contactQuery)
    const tabs = await queryFetcher(tabsQuery)
    const homepage = await queryFetcher(homePageQuery)
    const heroHomepage = await queryFetcher(heroSectionHomepageQuery)

    return (
        <div>
            <Header tabs={tabs} />
            <MFHero title={heroHomepage.sections.title} subTitle={heroHomepage.sections.subTitle} _type={heroHomepage.sections._type} layout={heroHomepage.sections.layout} image={heroHomepage.sections.image} />
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-[50%] flex flex-col">

                </div>
            </div>
            <Footer tabs={tabs} contacts={contacts} />
        </div>

    );
}

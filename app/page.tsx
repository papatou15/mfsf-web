import Footer from "./components/Footer";
import Header from "./components/Header";
import MFHero from "./components/MFHero";
import { queryFetcher, contactQuery, tabsQuery, homePageQuery, heroSectionHomepageQuery, heroSectionHomepageImageQuery } from "./queries";

export default async function Home() {
    const contacts = await queryFetcher(contactQuery)
    const tabs = await queryFetcher(tabsQuery)
    const homepage = await queryFetcher(homePageQuery)
    const heroHomepage = await queryFetcher(heroSectionHomepageQuery)
    const heroImage = await queryFetcher(heroSectionHomepageImageQuery)

    return (
        <div>
            <Header tabs={tabs} />
            <MFHero title={heroHomepage.sections.title} subTitle={heroHomepage.sections.subTitle} _type={heroHomepage.sections._type} layout={heroHomepage.sections.layout} image={heroHomepage.sections.image} imageWidth={heroImage.sections.image.asset.metadata.dimensions.width} imageHeight={heroImage.sections.image.asset.metadata.dimensions.height}/>
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-[50%] flex flex-col">

                </div>
            </div>
            <Footer tabs={tabs} contacts={contacts} />
        </div>

    );
}

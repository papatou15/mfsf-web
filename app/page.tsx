import Footer from "./components/Footer";
import Header from "./components/Header";
import MFHero from "./components/MFHero";
import { queryFetcher, contactQuery, tabsQuery, homePageQuery } from "./queries";

export default async function Home() {
    const contacts = await queryFetcher(contactQuery)
    const tabs = await queryFetcher(tabsQuery)
    const homepage = await queryFetcher(homePageQuery)

    return (
        <div>
            <Header tabs={tabs} />
            <MFHero title={homepage[0].sections[0].title} subTitle={homepage[0].sections[0].subTitle} _type={homepage[0].sections[0]._type} layout={homepage[0].sections[0].layout}/>
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-[50%] flex flex-col">

                </div>
            </div>
            <Footer tabs={tabs} contacts={contacts} />
        </div>
    );
}

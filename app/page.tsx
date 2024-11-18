import Footer from "./components/Footer";
import Header from "./components/Header";
import MFHero from "./components/MFHero";
import MFCard from "./components/Card";
import { queryFetcher, contactQuery, tabsQuery, homePageQuery, heroSectionHomepageQuery } from "./queries";
import TextOnPicture from "./components/TextOverImage";

export default async function Home() {
    
    
    const homepage = await queryFetcher(homePageQuery)
    const heroHomepage = await queryFetcher(heroSectionHomepageQuery)
    

    console.log(homepage.sections[2])

    return (
        <div>
            <MFHero title={heroHomepage.sections.title} subTitle={heroHomepage.sections.subTitle} _type={heroHomepage.sections._type} layout={heroHomepage.sections.layout} image={heroHomepage.sections.image}/>
            <div className="flex flex-col md:flex-row w-full">
                <MFCard _type="" title="Yeet" subtitle="Yeetus" image={heroHomepage.sections.image}/>
            </div>
            <TextOnPicture _type={homepage.sections[2]._type} title={homepage.sections[2].title} text={homepage.sections[2].text} layout="default" image={homepage.sections[2].image}/>
        </div>

    );
}

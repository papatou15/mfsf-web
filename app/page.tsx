import { queryFetcher, homePageQuery } from "./queries";
import SectionRenderer from "./components/SectionRenderer";
import Image from "next/image";
import newsletterImage from './medias/homepage_newsletter_bg.jpg'
import Typography from "./components/Typography/Typography";
import typographyTheme from "./components/theme/Typography";
import MFLink from "./components/MFLink";
import inputTheme from "./components/theme/Input";
import { SectionProps } from "./components/SectionRenderer";


interface Homepage {
    sections: SectionProps[];
}

export default async function Home() {
    const homepage: Homepage = await queryFetcher(homePageQuery)

    console.log(homepage.sections.map((section) => section.items));

    return (
        <div>
            {homepage.sections.map((section) => (
                <SectionRenderer key={section._key} section={section} {...section} />
            ))}
            <div className="w-full bg-[#F9EFE3] grid grid-cols-1 grid-rows-1 relative">
                <div className="w-[65vw] row-start-1 col-start-1 hidden xl:block">
                    <Image
                        src={newsletterImage}
                        alt="Newsletter background"
                        layout="responsive"
                    />
                </div>
                <div className="xl:row-start-1 xl:col-start-1 flex flex-col justify-start items-center xl:items-end xl:absolute xl:top-0 xl:right-0 xl:pt-32 xl:pr-20">
                    <Typography as={"h3"} className={typographyTheme({ size: 'h5'})}>{"Restez à l'affut de notre programmation!"}</Typography>
                    <input type="email" placeholder="Votre adresse email" className={`${inputTheme()} w-[75%] xl:w-full my-16 xl:my-20`} />
                    <MFLink _type="button" link="#" style={"coloredbg"}>{"S'inscrire"}</MFLink>
                </div>
            </div>
        </div>
    );
}

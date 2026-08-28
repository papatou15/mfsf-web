import { queryFetcher, homePageQuery } from "./queries";
import SectionRenderer from "./components/SectionRenderer";
import Image from "next/image";
import newsletterImage from './medias/homepage_newsletter_bg.jpg'
import Typography from "./components/Typography/Typography";
import typographyTheme from "./components/theme/Typography";
import { SectionProps } from "./components/SectionRenderer";
import NewsletterSignup from "./components/NewsletterSignup";


interface Homepage {
    sections: SectionProps[];
}

export default async function Home() {
    const homepage: Homepage = await queryFetcher(homePageQuery)
    

    return (
        <div>
            {homepage.sections.map((section) => (
                <SectionRenderer key={section._key} section={section} {...section} />
            ))}
            <section className="relative isolate grid w-full grid-cols-1 grid-rows-1 overflow-hidden bg-[#F9EFE3]">
                <div className="col-start-1 row-start-1 hidden w-[65vw] xl:block">
                    <Image
                        src={newsletterImage}
                        alt=""
                        sizes="65vw"
                        className="h-auto w-full"
                    />
                </div>
                <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 xl:absolute xl:right-0 xl:top-0 xl:mx-0 xl:min-h-0 xl:w-auto xl:max-w-none xl:items-end xl:justify-start xl:px-0 xl:py-0 xl:pr-20 xl:pt-32">
                    <div className="flex w-full max-w-xl flex-col items-center xl:items-end">
                        <Typography as={"h3"} className={`${typographyTheme({ size: 'h5'})} text-center xl:text-left`}>{"Restez à l'affut de notre programmation!"}</Typography>
                        <NewsletterSignup />
                    </div>
                </div>
            </section>
        </div>
    );
}

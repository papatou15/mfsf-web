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
            <section className="relative isolate w-full overflow-hidden bg-[#F9EFE3]">
                <div className="absolute inset-y-0 left-0 hidden w-[62%] xl:block">
                    <Image
                        src={newsletterImage}
                        alt=""
                        fill
                        sizes="62vw"
                        className="object-cover object-left"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F9EFE3]/20 to-[#F9EFE3]" />
                </div>
                <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 xl:justify-end xl:px-12 xl:py-16">
                    <div className="flex w-full max-w-xl flex-col items-center">
                        <Typography as={"h3"} className={`${typographyTheme({ size: 'h5'})} text-center`}>{"Restez à l'affut de notre programmation!"}</Typography>
                        <NewsletterSignup />
                    </div>
                </div>
            </section>
        </div>
    );
}

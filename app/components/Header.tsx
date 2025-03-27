/* eslint-disable @next/next/no-img-element */
import MFButton from "./MFButton";
import { PageMaker, Contact } from "@/sanity.types";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MFLink from "./MFLink";
import { headerLogoQuery, queryFetcher } from "../queries";
import sanityImgUrl from "../sanityImageBuilder";

interface Props {
    tabs: PageMaker[];
}

const Header: React.FC<Props> = async ({ tabs }) => {

    const logo: Contact = await queryFetcher(headerLogoQuery)

    return (
        <div className="header-wrapper w-full flex md:sticky top-0 z-50 items-center justify-center">
            <div className="header m-4 w-full h-full bg-gradient-to-l from-primary-blue to-[#0D5E68] flex flex-row rounded-2xl shadow-[0_55px_50px_-25px_rgba(0,0,0,0.25)]">
                <div className="pl-6 py-2 min-w-20">
                    <img src={sanityImgUrl(logo.headerLogo).height(75).fit("clip").url()} alt="Maison de la Famille de St-François" />
                </div>
                <div className="flex flex-row flex-wrap w-fit justify-center">
                    {tabs ? tabs.map((tab) => {
                        return (
                            <MFLink link={`/${tab.slug?.current == "accueil" ? "" : tab.slug?.current}`} style="smallcolorless" key={tab._id} extraCSS="h-auto mx-10 md:mx-12 text-off-white text-xl shadow-text-sm" _type={"button"}>
                                {tab.title || "No Title"}
                            </MFLink>
                        );
                    }) : "no tabs"}
                </div>
                <div className="flex items-center flex-row ml-auto">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <MFButton style="smallbg" _type="button">
                                Connexion
                            </MFButton>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            showName={true}
                            appearance={{
                                elements: {
                                    userButtonBox: 'h-6 bg-off-white hover:bg-primary-blue m-5 p-4 md:p-6 rounded-2xl text-black border-2 border-black hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-transltate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-accent-1',
                                    userButtonPopoverMain: 'border-2 border-black rounded-2xl text-black',
                                    userButtonPopoverActionButton: 'text-black',
                                }
                            }}
                        />
                        <MFLink _type="button" link="/account" style="smallbg">Portail de membre</MFLink>
                    </SignedIn>
                </div>
            </div>
        </div>
    );
};

export default Header;
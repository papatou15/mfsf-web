import MFButton from "./MFButton";
import { PageMaker } from "@/sanity.types";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MFLink from "./MFLink";

interface Props {
    tabs: PageMaker[];
}

const Header: React.FC<Props> = ({ tabs }) => {

    return (
        <div className="header w-full bg-primary h-28 flex flex-row border-[5px] border-black">
            <div className="w-44 h-full">

            </div>
            <div className="flex flex-row w-fit justify-center">
                {tabs ? tabs.map((tab) => {
                    return (
                        <MFLink link={`/${tab.slug?.current == "accueil" ? "" : tab.slug?.current}`} style="smallcolorless" key={tab._id} extraCSS="h-auto mx-10 md:mx-12 text-off-white text-2xl" _type={"button"}>
                            {tab.title || "No Title"}
                        </MFLink>
                    );
                }) : "no tabs"}
            </div>
            <div className="flex items-center flex-row ml-auto">
                <SignedOut>
                    <SignInButton>
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
                                userButtonTrigger: 'h-6 bg-yellow-1 hover:bg-yellow-2 m-5 p-4 md:p-6 rounded-2xl text-black border-2 border-black text-lg hover:shadow-button transition-all duration-100 hover:translate-x-1 hover:-transltate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 active:bg-accent-1',
                                userButtonPopoverMain: 'border-2 border-black rounded-2xl text-black',
                                userButtonPopoverActionButton: 'text-black',
                            }
                        }}
                    />
                    <MFLink _type="button" link="/account" style="smallbg">Portail de membre</MFLink>
                </SignedIn>
            </div>
        </div>
    );
};

export default Header;
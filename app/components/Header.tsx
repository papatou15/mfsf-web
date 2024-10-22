import MFButton from "./MFButton";
import { PageMaker } from "@/sanity.types";
import { FaRegUserCircle } from "react-icons/fa";
import MFLink from "./MFLink";

interface Props {
    tabs: PageMaker[];
}

const Header: React.FC<Props> = ({tabs}) => {
    return(
    <div className="w-full bg-primary h-28 flex flex-row border-[5px] border-black">
        <div className="w-44 h-full">

        </div>
        <div className="flex flex-row w-fit justify-center">
        {tabs ? tabs.map((tab) =>
            <MFLink link="" styling="nobg" key={tab._id} extraCSS="h-auto mx-10 md:mx-12 text-off-white text-2xl">
                {tab.title}
            </MFLink>
        ) : "no tabs"}
        </div>
        <div className="flex items-center flex-row ml-auto">
            <MFButton styling="smallbg">
                Mon compte <FaRegUserCircle/>
            </MFButton>
            <MFButton styling="smallbg">
                Déconnexion
            </MFButton>
        </div>
    </div>
    )
    
}

export default Header

export type HeaderProps = typeof Header
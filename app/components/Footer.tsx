import { PageMaker, Contact } from "@/sanity.types";

interface Props {
    tabs: PageMaker[];
    contacts: Contact;
}

const Footer: React.FC<Props> = ({tabs, contacts}) => {
    return(
        <div className="flex flex-col lg:flex-row items-center px-20 lg:px-52 bg-primary lg:h-[400px] font-text text-lg text-off-white border-[5px] border-black">
            <div className="lg:w-[33%] lg:h-[70%] text-xl flex flex-col justify-center items-center">
                <h2 className="p-3 font-semiblod text-3xl">Navigation</h2>
                {tabs ? tabs.map((tab) => 
                    <div key={tab._id}>
                        {tab.title}
                    </div>
                ) : "no tabs"}
            </div>
            <div className="w-full lg:h-[70%] "></div>
            <div className="lg:w-[33%] lg:h-[70%] flex flex-col justify-center items-center">
                <div className="flex flex-col p-3 items-center">
                    <h3 className="p-3 font-semibold">Pour nous joindre</h3>
                    <p>Téléphone: {contacts.telephone}</p>
                    <p>{contacts.email}</p>
                    <p>{contacts.adress}</p>
                </div>
                <div className="flex flex-col p-3 items-center">
                    <h3 className="p-3 font-semibold">Liens utiles:</h3>
                    <p>Prévention suicide: 988</p>
                    <p>Urgence: 911</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
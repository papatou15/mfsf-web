import {FaMapMarkerAlt, FaPhone} from "react-icons/fa";

type HomeContactBlockProps = {
    title?: string;
    text?: string;
    address?: string;
    phoneNumber?: string;
    phoneLabel?: string;
    directionsUrl?: string;
    directionsLabel?: string;
};

export default function HomeContactBlock({
    title = "Nous joindre",
    text,
    address,
    phoneNumber,
    phoneLabel,
    directionsUrl,
    directionsLabel,
}: HomeContactBlockProps) {
    const telephoneHref = phoneNumber ? `tel:${phoneNumber.replace(/[^+\d]/g, "")}` : null;

    return (
        <section className="w-full px-4 py-12 md:py-16">
            <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-3xl border-2 border-black bg-primary-blue p-7 text-white shadow-big-box-bg md:grid-cols-[1fr_auto] md:items-center md:p-10">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em]">Maison de la Famille de St-François</p>
                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
                    {text ? <p className="mt-4 max-w-2xl text-lg">{text}</p> : null}
                    {address ? (
                        <p className="mt-5 flex items-start gap-3 text-lg font-bold">
                            <FaMapMarkerAlt aria-hidden="true" className="mt-1 shrink-0" />
                            {address}
                        </p>
                    ) : null}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
                    {telephoneHref ? (
                        <a href={telephoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 font-bold text-black shadow-button">
                            <FaPhone aria-hidden="true" />
                            {phoneLabel || phoneNumber}
                        </a>
                    ) : null}
                    {directionsUrl ? (
                        <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-primary-orange px-5 py-3 font-bold text-white shadow-button">
                            <FaMapMarkerAlt aria-hidden="true" />
                            {directionsLabel || "Obtenir l’itinéraire"}
                        </a>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

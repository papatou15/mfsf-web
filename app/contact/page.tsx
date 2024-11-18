import typographyTheme from "../components/theme/Typography";
import Typography from "../components/Typography/Typography";
import Map from "../components/GoogleMap";
import FormContact from "../components/forms/FormContact";

export default async function Contact() {
    // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    const markers = [
        { lat: 45.66297421713217, lng: -73.57978371107636 },
    ]

    return (
        <div className="flex flex-col mx-24 my-12">
            <div>
                <Typography as="h1" className={`mb-7 ${typographyTheme({ size: 'h3' })}`}>
                    Nous contacter
                </Typography>
            </div>
            <div className="flex flex-row">
                <div className="w-1/2">
                    <Typography as="h3" className={`${typographyTheme({ size: 'h5' })}`}>
                        Nous rejoindre
                    </Typography>
                    <div className="my-7">
                        <div className="my-2">
                            <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>450-665-6510</Typography>
                        </div>
                        <div className="my-2">
                            <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>info@maisonfamillestfrancois.com</Typography>
                        </div>
                        <div className="my-2">
                            <Typography as="span" className={typographyTheme({ size: 'paragraph' })}>8190 Boul. Lévesque Est, H7A 1V4</Typography>
                        </div>
                    </div>
                    <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} markers={markers} />
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="m-auto">
                        <Typography as="h3" className={typographyTheme({size: 'h5'})}>Vous avez une question?</Typography>
                    </div>
                    <FormContact />
                </div>
            </div>
        </div>
    )
}
import { currentUser } from "@clerk/nextjs/server";
import { memberQueryFetcher, accountPageQuery } from "../queries";
import { Inscription } from "@/sanity.types";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";

interface AccountPageProps extends Inscription{
    clerkEmail: string;
    clerkNom: string;
    clerkNom_famille: string;
}

export default async function AccountPage({clerkNom, clerkNom_famille, clerkEmail}: AccountPageProps) {
    const user = await currentUser();
    clerkNom = user?.firstName ?? '';
    clerkNom_famille = user?.lastName ?? '';
    clerkEmail = user?.emailAddresses[0].emailAddress ?? '';

    const accountPage: AccountPageProps[] = await memberQueryFetcher(accountPageQuery, { email: clerkEmail, nom: clerkNom, nom_famille: clerkNom_famille });

    console.log("accountPage: ", accountPage);

    if (accountPage.length === 0) {
        return null
    }

    if (clerkNom !== accountPage[0].nom || clerkNom_famille !== accountPage[0].nom_famille || clerkEmail !== accountPage[0].email) {
        return (
            <div>
                <Typography as={"h1"} className={typographyTheme({ size: 'h1'})}>Erreur</Typography>
                <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
            </div>
        )
    }

    return (
        <div>
            <SignedIn>
                <div>
                    {/* <Typography as={"h1"} className={typographyTheme({ size: 'h1'})}>Bonjour {sanityNom} {sanityNomFamille}!</Typography>
                    <p>Adresse courriel: {sanityEmail}</p>
                    <p>Activités inscrites:</p> */}
                    
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>

    )
}
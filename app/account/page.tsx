import { currentUser } from "@clerk/nextjs/server";
import { memberQueryFetcher, accountPageQuery } from "../queries";
import { Inscription } from "@/sanity.types";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import SignUpForm from "../components/SignUpForm";

interface AccountPageProps extends Inscription {
    clerkEmail: string;
    clerkNom: string;
    clerkNom_famille: string;
}

export default async function AccountPage() {
    const user = await currentUser();
    const clerkNom = user?.firstName ?? '';
    const clerkNom_famille = user?.lastName ?? '';
    const clerkEmail = user?.emailAddresses[0].emailAddress ?? '';

    const accountPage: AccountPageProps[] = await memberQueryFetcher(accountPageQuery, { email: clerkEmail, nom: clerkNom, nom_famille: clerkNom_famille });

    if (accountPage.length === 0) {
        return null;
    }

    if (clerkNom !== accountPage[0].nom || clerkNom_famille !== accountPage[0].nom_famille || clerkEmail !== accountPage[0].email) {
        return (
            <div>
                <Typography as={"h1"} className={typographyTheme({ size: 'h1'})}>Erreur</Typography>
                <p>Vous n&apos;êtes pas autorisé à accéder à cette page.</p>
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
                    <SignUpForm clerkEmail={clerkEmail} clerkNom={clerkNom} clerkNom_famille={clerkNom_famille} _type={"inscription"} _id={""} _createdAt={""} _updatedAt={""} _rev={""}  />
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>

    )
}
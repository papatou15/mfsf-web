"use client"; // Required in Next.js for client components

import { useAuth } from "../AuthContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import SignUpForm from "../components/forms/SignUpForm";

export default function AccountPage() {
    const { clerkUser, sanityMember, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;

    // If the user is not found in Sanity, show the SignUpForm
    if (!sanityMember && clerkUser) {
        return (
            <div>
                <SignUpForm
                    clerkEmail={clerkUser.email}
                    clerkNom={clerkUser.firstName}
                    clerkNom_famille={clerkUser.lastName}
                    _type={"inscription"}
                    _id={""}
                    _createdAt={""}
                    _updatedAt={""}
                    _rev={""}
                />
            </div>
        );
    }

    return (
        <div>
            <SignedIn>
                <div>
                    <Typography as={"h1"} className={typographyTheme({ size: 'h1' })}>
                        Bonjour, {clerkUser?.firstName}
                    </Typography>
                    <div>
                        <Typography as={"h2"} className={typographyTheme({ size: 'h2' })}>
                            Vos informations
                        </Typography>
                        <div>
                            <p>Email: {clerkUser?.email}</p>
                            <p>Nom: {sanityMember?.nom}</p>
                            <p>Nom de famille: {sanityMember?.nom_famille}</p>
                            {/* Add more fields as necessary */}
                        </div>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}

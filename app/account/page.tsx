/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Required in Next.js for client components

import { useAuth } from "../AuthContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import SignUpForm from "../components/forms/SignUpForm";
import { Inscription, Activity } from "@/sanity.types";

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
                            Mes inscriptions
                        </Typography>
                        <div>
                            {sanityMember?.linkedActivities && sanityMember.linkedActivities.length > 0 ? (
                                sanityMember.linkedActivities.map((activity, index) => (
                                    <div key={index}>
                                        <Typography as={"h3"} className={typographyTheme({ size: 'h3' })}>
                                            {activity?.activityId?.nom}
                                        </Typography>
                                        <div key={index}>
                                            <Typography as={"p"} className={typographyTheme({ size: 'paragraph' })}>
                                                {activity.date ?? "Date inconnue"}
                                            </Typography>
                                        </div>
                                        
                                    </div>
                                ))
                            ) : (
                                <Typography as={"p"} className={typographyTheme({ size: 'paragraph' })}>
                                    Aucune activité trouvée.
                                </Typography>
                            )}
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

"use client"; // Required in Next.js for client components

import { useAuth } from "../AuthContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import SignUpForm from "../components/forms/SignUpForm";
import { useEffect, useState } from "react";
import { accountActivitiesFetcher, memberActivitiesQuery } from "../queries";

export default function AccountPage() {
    const { clerkUser, sanityMember, loading } = useAuth();
    const [activities, setActivities] = useState<[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            if (sanityMember) {
                try {
                    const result = await accountActivitiesFetcher(memberActivitiesQuery, { memberId: sanityMember._id });
                    setActivities(result);
                }
                catch (error) {
                    console.error("Error fetching activities:", error);
                }
            }
        }

        fetchActivities();
    }, [sanityMember]);

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
                            {activities.length > 0 ? (
                                activities.map((activity: any) => (
                                    <div key={activity._id}>
                                        <Typography as={"h3"} className={typographyTheme({ size: 'h3' })}>
                                            {activity.title}
                                        </Typography>
                                        <Typography as={"p"} className={typographyTheme({ size: 'paragraph' })}>
                                            {activity.description}
                                        </Typography>
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

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
                    <SignUpForm
                        clerkEmail={clerkUser?.email ?? ""}
                        clerkNom={clerkUser?.firstName ?? ""}
                        clerkNom_famille={clerkUser?.lastName ?? ""}
                        _type={"inscription"}
                        _id={sanityMember?._id ?? ""}
                        _createdAt={sanityMember?._createdAt ?? ""}
                        _updatedAt={sanityMember?._updatedAt ?? ""}
                        _rev={sanityMember?._rev ?? ""}
                    />
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}

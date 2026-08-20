"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { memberQueryFetcher, accountPageQuery } from "./queries";
import { Activity, Inscription } from "@/sanity.types";

type AccountLinkedActivity = {
    _key?: string;
    date?: string;
    activityId?: Pick<Activity, "nom"> | null;
};

export type AccountSanityMember = Omit<Inscription, "linkedActivities"> & {
    linkedActivities?: AccountLinkedActivity[];
};

interface AuthContextType {
    clerkUser: { id: string; email: string; firstName: string; lastName: string } | null;
    sanityMember: AccountSanityMember | null;
    loading: boolean;
}

type MemberResult = {
    email: string;
    member: AccountSanityMember | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoaded } = useUser();
    const [memberResult, setMemberResult] = useState<MemberResult | null>(null);
    const email = user?.primaryEmailAddress?.emailAddress ?? "";

    useEffect(() => {
        if (!isLoaded || !user || !email) return;

        let active = true;
        const firstName = user.firstName ?? "";
        const lastName = user.lastName ?? "";

        memberQueryFetcher<AccountSanityMember[]>(accountPageQuery, {
            email,
            nom: firstName,
            nom_famille: lastName,
        })
            .then((members) => {
                if (active) setMemberResult({ email, member: members[0] ?? null });
            })
            .catch((error) => {
                console.error(error);
                if (active) setMemberResult({ email, member: null });
            });

        return () => {
            active = false;
        };
    }, [email, isLoaded, user]);

    const resultMatchesUser = memberResult?.email === email;
    const sanityMember = user && resultMatchesUser ? memberResult.member : null;
    const loading = !isLoaded || Boolean(user && !resultMatchesUser);

    return (
        <AuthContext.Provider
            value={{
                clerkUser: user ? { id: user.id, email, firstName: user.firstName ?? "", lastName: user.lastName ?? "" } : null,
                sanityMember,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

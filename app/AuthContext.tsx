"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
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
    memberLookupError: boolean;
}

type MemberResult = {
    userId: string;
    member: AccountSanityMember | null;
    error: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoaded } = useUser();
    const [memberResult, setMemberResult] = useState<MemberResult | null>(null);
    const email = user?.primaryEmailAddress?.emailAddress ?? "";

    useEffect(() => {
        if (!isLoaded) return;
        if (!user) return;

        let active = true;

        fetch("/api/account", { cache: "no-store" })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Member lookup failed with status ${response.status}`);
                return response.json() as Promise<{ member: AccountSanityMember | null }>;
            })
            .then(({ member }) => {
                if (active) setMemberResult({ userId: user.id, member, error: false });
            })
            .catch((error) => {
                console.error(error);
                if (active) setMemberResult({ userId: user.id, member: null, error: true });
            });

        return () => {
            active = false;
        };
    }, [isLoaded, user]);

    const resultMatchesUser = memberResult?.userId === user?.id;
    const sanityMember = user && resultMatchesUser ? memberResult?.member ?? null : null;
    const loading = !isLoaded || Boolean(user && !resultMatchesUser);
    const memberLookupError = Boolean(user && resultMatchesUser && memberResult?.error);

    return (
        <AuthContext.Provider
            value={{
                clerkUser: user ? { id: user.id, email, firstName: user.firstName ?? "", lastName: user.lastName ?? "" } : null,
                sanityMember,
                loading,
                memberLookupError,
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

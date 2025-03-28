"use client"; // Needed for React Context in Next.js

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { memberQueryFetcher, accountPageQuery } from "./queries";
import { Inscription } from "@/sanity.types";

interface AuthContextType {
    clerkUser: { id: string; email: string; firstName: string; lastName: string } | null;
    sanityMember: Inscription | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoaded } = useUser(); // Clerk user
    const [sanityMember, setSanityMember] = useState<Inscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        if (user) {
            setLoading(true);
            const clerkEmail = user.emailAddresses[0]?.emailAddress ?? "";
            const clerkNom = user.firstName ?? "";
            const clerkNom_famille = user.lastName ?? "";

            // Fetch member from Sanity
            memberQueryFetcher(accountPageQuery, { email: clerkEmail, nom: clerkNom, nom_famille: clerkNom_famille })
                .then((members) => setSanityMember(members.length > 0 ? members[0] : null))
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setSanityMember(null);
            setLoading(false);
        }
    }, [user, isLoaded]);

    return (
        <AuthContext.Provider
            value={{
                clerkUser: user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress ?? "", firstName: user.firstName ?? "", lastName: user.lastName ?? "" } : null,
                sanityMember,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

"use client";

import { useAuth } from "../AuthContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import SignUpForm from "../components/forms/SignUpForm";
import Link from "next/link";
import { FaCalendarAlt, FaEnvelope, FaMapMarkerAlt, FaPhone, FaRegUser } from "react-icons/fa";

const phoneTypeLabels = {
    home: "Maison",
    cell: "Cellulaire",
    work: "Bureau",
    other: "Autre",
} as const;

function formatDate(value?: string) {
    if (!value) return "Date non précisée";

    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("fr-CA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export default function AccountPage() {
    const { clerkUser, sanityMember, loading } = useAuth();

    if (loading) {
        return (
            <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-16" aria-busy="true">
                <div className="h-12 w-72 animate-pulse rounded-xl bg-gray-200" />
                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <div className="h-80 animate-pulse rounded-3xl bg-gray-200" />
                    <div className="h-80 animate-pulse rounded-3xl bg-gray-200" />
                </div>
                <span className="sr-only">Chargement de votre espace membre…</span>
            </main>
        );
    }

    // If the user is not found in Sanity, show the SignUpForm
    if (!sanityMember && clerkUser) {
        return (
            <main>
                <SignUpForm />
            </main>
        );
    }

    const activities = [...(sanityMember?.linkedActivities ?? [])].sort((a, b) =>
        (b.date ?? "").localeCompare(a.date ?? ""),
    );
    const displayName = [sanityMember?.nom ?? clerkUser?.firstName, sanityMember?.nom_famille ?? clerkUser?.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <main className="min-h-[70vh] bg-custom-beige/40 px-4 py-10 sm:px-8 lg:px-14 lg:py-16">
            <SignedIn>
                <div className="mx-auto max-w-7xl">
                    <header className="mb-10">
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary-blue">Espace membre</p>
                        <h1 className="text-4xl font-bold sm:text-5xl">Bonjour, {(sanityMember?.nom ?? clerkUser?.firstName) || "bienvenue"}!</h1>
                        <p className="mt-3 max-w-2xl text-lg text-gray-700">
                            Retrouvez vos renseignements et les activités auxquelles vous êtes inscrit.
                        </p>
                    </header>

                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.65fr)]">
                        <aside className="space-y-6">
                            <section className="overflow-hidden rounded-3xl border-2 border-black bg-white shadow-big-box-bg">
                                <div className="bg-primary-blue px-6 py-7 text-off-white">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                                        <FaRegUser aria-hidden="true" className="text-2xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Mes informations</h2>
                                    <p className="mt-1 text-white/85">{displayName || "Membre"}</p>
                                </div>
                                <dl className="space-y-5 p-6">
                                    <div className="flex gap-3">
                                        <FaEnvelope aria-hidden="true" className="mt-1 shrink-0 text-primary-blue" />
                                        <div className="min-w-0">
                                            <dt className="text-sm font-bold text-gray-600">Courriel</dt>
                                            <dd className="break-words">{sanityMember?.email ?? clerkUser?.email}</dd>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <FaPhone aria-hidden="true" className="mt-1 shrink-0 text-primary-blue" />
                                        <div>
                                            <dt className="text-sm font-bold text-gray-600">Téléphone</dt>
                                            <dd>
                                                {sanityMember?.phone?.length ? (
                                                    <ul className="space-y-1">
                                                        {sanityMember.phone.map((phone) => (
                                                            <li key={phone._key}>
                                                                {phone.phone_no ?? "Non précisé"}
                                                                {phone.phone_type ? ` — ${phoneTypeLabels[phone.phone_type]}` : ""}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : "Non précisé"}
                                            </dd>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <FaMapMarkerAlt aria-hidden="true" className="mt-1 shrink-0 text-primary-blue" />
                                        <div>
                                            <dt className="text-sm font-bold text-gray-600">Code postal</dt>
                                            <dd>{sanityMember?.zip_code ?? "Non précisé"}</dd>
                                        </div>
                                    </div>
                                </dl>
                            </section>

                            <section className="rounded-3xl border-2 border-black bg-primary-green p-6 text-off-white shadow-big-box-bg">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-bold">Mon adhésion</h2>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-primary-green">
                                        {sanityMember?.member_check ? "Membre actif" : "À confirmer"}
                                    </span>
                                </div>
                                <dl className="mt-5 space-y-3 text-sm">
                                    <div>
                                        <dt className="font-bold">Date d’adhésion</dt>
                                        <dd>{formatDate(sanityMember?.member_form?.adhesionTime)}</dd>
                                    </div>
                                    {sanityMember?.member_form?.renewTime ? (
                                        <div>
                                            <dt className="font-bold">Date de renouvellement</dt>
                                            <dd>{formatDate(sanityMember.member_form.renewTime)}</dd>
                                        </div>
                                    ) : null}
                                </dl>
                            </section>
                        </aside>

                        <section className="rounded-3xl border-2 border-black bg-white p-6 shadow-big-box-bg sm:p-8">
                            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-orange">Mes inscriptions</p>
                                    <h2 className="mt-1 text-3xl font-bold">Activités enregistrées</h2>
                                </div>
                                <span className="w-fit rounded-full bg-primary-orange/15 px-4 py-2 font-bold text-primary-orange">
                                    {activities.length} {activities.length === 1 ? "activité" : "activités"}
                                </span>
                            </div>

                            {activities.length > 0 ? (
                                <ul className="space-y-4">
                                    {activities.map((activity, index) => (
                                        <li
                                            key={activity._key ?? `${activity.activityId?.nom}-${activity.date}-${index}`}
                                            className="flex flex-col gap-4 rounded-2xl border-2 border-gray-200 p-5 transition-colors hover:border-primary-blue sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold">{activity.activityId?.nom ?? "Activité"}</h3>
                                                <p className="mt-2 flex items-center gap-2 text-gray-700">
                                                    <FaCalendarAlt aria-hidden="true" className="text-primary-orange" />
                                                    {formatDate(activity.date)}
                                                </p>
                                            </div>
                                            <span className="w-fit rounded-full bg-primary-green/15 px-3 py-1 text-sm font-bold text-primary-green">
                                                Inscrit
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-gray-300 px-6 py-14 text-center">
                                    <FaCalendarAlt aria-hidden="true" className="mx-auto mb-4 text-4xl text-primary-orange" />
                                    <h3 className="text-xl font-bold">Aucune activité enregistrée</h3>
                                    <p className="mx-auto mt-2 max-w-md text-gray-700">
                                        Lorsque vous vous inscrirez à une activité, elle apparaîtra ici avec sa date.
                                    </p>
                                    <Link
                                        href="/activites"
                                        className="mt-6 inline-flex rounded-xl border-2 border-black bg-primary-orange px-5 py-3 font-bold text-white shadow-button"
                                    >
                                        Découvrir les activités
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </main>
    );
}

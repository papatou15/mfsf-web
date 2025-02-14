"use client"

import { Inscription } from "@/sanity.types";
import { Label, Input, Field, Listbox, ListboxButton, ListboxOptions, ListboxOption, Checkbox, Fieldset, Legend } from "@headlessui/react";
import Typography from "../Typography/Typography";
import typographyTheme from "../theme/Typography";
import formLabelTheme from "../theme/FormLabel";
import DynamicInputList from "./components/DynamicInputList";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import MFButton from "../MFButton";
import { sanityClient } from "../../sanityClient";
import inputTheme from "../theme/Input";
import { tv } from "tailwind-variants";


interface SignUpFormProps extends Inscription {
    clerkEmail: string;
    clerkNom: string;
    clerkNom_famille: string;
}

const statutFamilialOptions = [
    { id: 1, value: 'celibataire', name: 'Célibataire' },
    { id: 2, value: 'couple', name: 'En couple' },
    { id: 3, value: 'marie', name: 'Marié(e)' },
    { id: 4, value: 'veuf', name: 'Veuf(ve)' },
    { id: 5, value: 'no_answer', name: 'Préfère ne pas répondre' }
]

const occupationOptions = [
    { id: 1, value: 'full_time', name: 'Emploi temps plein' },
    { id: 2, value: 'half-time', name: 'Emploi temps partiel' },
    { id: 3, value: 'at_home', name: 'Sans emploi/Au foyer' },
    { id: 4, value: 'autonome', name: 'Travailleur autonome' },
    { id: 5, value: 'etudiant', name: 'Étudiant' },
    { id: 6, value: 'retraite', name: 'Retraité' },
    { id: 7, value: 'no_answer', name: 'Préfère ne pas répondre' }
]

const revenusOptions = [
    { id: 1, value: '<10k', name: 'Moins de 10 000$' },
    { id: 2, value: '10k-20k', name: '10 001$ à 20 000$' },
    { id: 3, value: '20k-30k', name: '20 001$ à 30 000$' },
    { id: 4, value: '30k-40k', name: '30 001$ à 40 000$' },
    { id: 5, value: '40k-50k', name: '40 001$ à 50 000$' },
    { id: 6, value: '>50k', name: '50 001$ et plus' },
    { id: 7, value: 'no_answer', name: 'Préfère ne pas répondre' }
]

const domainesACouvrir = [
    { id: 1, value: 'denrees', name: 'Denrées' },
    { id: 2, value: 'jouets', name: 'Lavage des jouets' },
    { id: 3, value: 'menage', name: 'Ménage' },
    { id: 4, value: 'cuisine', name: 'Cuisson de nourriture' },
    { id: 5, value: 'friperie', name: 'Friperie' },
    { id: 6, value: 'terrain', name: 'Travaux sur le terrain' },
    { id: 7, value: 'secretariat', name: 'Travaux de secrétariats' },
    { id: 8, value: 'camion', name: 'Vider le camion et tri de la nourriture' }
]

const benevolatDispo = [
    { id: 1, value: 'lundi-am', name: 'Lundi AM' },
    { id: 1, value: 'lundi-pm', name: 'Lundi PM' },
    { id: 1, value: 'mardi-am', name: 'Mardi AM' },
    { id: 1, value: 'mardi-pm', name: 'Mardi PM' },
    { id: 1, value: 'mercredi-am', name: 'Mercredi AM' },
    { id: 1, value: 'mercredi-pm', name: 'Mercredi PM' },
    { id: 1, value: 'jeudi-am', name: 'Jeudi AM' },
    { id: 1, value: 'jeudi-pm', name: 'Jeudi PM' },
    { id: 1, value: 'vendredi-am', name: 'Vendredi AM' },
    { id: 1, value: 'vendredi-pm', name: 'Vendredi PM' },
    { id: 1, value: 'samedi-am', name: 'Samedi AM' },
    { id: 1, value: 'samedi-pm', name: 'Samedi PM' },
]

const raisonConnaissance = [
    { id: 1, name: 'Site Internet', value: 'website' },
    { id: 2, name: 'Instagram', value: 'instagram' },
    { id: 3, name: 'Facebook', value: 'facebook' },
    { id: 4, name: 'Autre membre', value: 'membre' },
    { id: 5, name: 'Famille', value: 'famille' },
    { id: 6, name: 'Autre', value: 'other' },
    { id: 7, name: 'Préfère ne pas répondre', value: 'nePasRepondre' }
]

const listBoxTheme = tv({
    base: "p-4 bg-white rounded-xl border-black border-2",
    variants: {
        lowPadding: {
            true: 'p-2 rounded-lg'
        },
        readOnly: {
            true: 'bg-slate-200 border-none'
        }
    }
})

const listBoxOptionsTheme = tv({
    base: "bg-white rounded-xl shadow-2xl border-black border-2 mt-3 cursor-pointer"
})

const listBoxOptionTheme = tv({
    base: "py-2 px-5 data-[focus]:bg-slate-300 transition-all ease-in duration-200"
})

export default function SignUpForm({ clerkNom, clerkEmail, clerkNom_famille }: SignUpFormProps) {

    const [loading, setLoading] = useState(false)

    // Code postal
    const [codePostal, setCodePostal] = useState("");

    // Téléphones
    const [telephones, setTelephones] = useState<Record<string, string>[]>([]);

    const handlePhoneNumberChange = (values: Record<string, string>[]) => {
        setTelephones(values);
    }

    const formattedTelephones = telephones.map(telephone => ({
        _type: 'phone_form',
        phone_type: telephone.type,
        phone_no: telephone.number,
        _key: crypto.randomUUID
    }))

    // Statut familial
    const [statutFamilial, setStatutFamilial] = useState(statutFamilialOptions[0]);

    // Occupation
    const [occupation, setOccupation] = useState(occupationOptions[0]);

    // Revenus familiaux
    const [revenus, setRevenus] = useState(revenusOptions[0]);

    // Date de naissance
    const [dateNaissance, setDateNaissance] = useState("");

    // Langue principale
    const [languePrincipale, setLanguePrincipale] = useState("");

    // Langues secondaire
    const [languesSecondaires, setLanguesSecondaires] = useState<Record<string, string>[]>([]);

    const handleLanguesSecondairesChange = (values: Record<string, string>[]) => {
        setLanguesSecondaires(values);
    }

    const formattedLanguesSecondaires = languesSecondaires.map(langue => ({
        langue: langue.langue
    }))

    // Membres de la famille
    const [familyMembers, setFamilyMembers] = useState<Record<string, string>[]>([]);

    const handleFamilyMembersChange = (values: Record<string, string>[]) => {
        setFamilyMembers(values);
    }

    const formattedFamilyMembers = familyMembers.map(familyMember => ({
        nom: familyMember.nom,
        nom_famille: familyMember.nom_famille,
        age: familyMember.age,
        genre_check: {
            genre: familyMember.genre
        },
        familyLink: familyMember.familyLink,
        _key: crypto.randomUUID
    }))

    // Famille immédiate
    const [immediateFamily, setImmediateFamily] = useState(0);

    // Bénévolat Check
    const [benevolatCheckEnabled, setBenevolatCheckEnabled] = useState(false);

    // Domaines à couvrir
    const [domainesACouvrirValue, setDomainesACouvrirValue] = useState<string[]>([])

    const handleDomainesACouvrirChange = (value: string) => {
        setDomainesACouvrirValue((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    // Disponibilités
    const [disponibilitesValue, setDisponibilitesValue] = useState<string[]>([])

    const handleDisponibiliteChange = (value: string) => {
        setDisponibilitesValue((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    // Raison d'engagement
    const [implicationMessage, setImplicationMessage] = useState("")

    // Comment avoir connu la placeholder
    const [connaissance, setConnaissance] = useState(raisonConnaissance[0])

    // Send to Sanity

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            _type: 'inscription',
            nom: clerkNom,
            nom_famille: clerkNom_famille,
            zip_code: codePostal,
            phone: formattedTelephones,
            email: clerkEmail,
            member_check: true,
            member_form: {
                occupation: occupation.value,
                date_naissance: dateNaissance,
                langue_principale: languePrincipale,
                langues_secondaires: formattedLanguesSecondaires,
                familial_status: statutFamilial.value,
                family_members: formattedFamilyMembers,
                immediate_family: immediateFamily,
                revenus: revenus.value
            },
            benevole_check: benevolatCheckEnabled,
            benevole_form: {
                domaines: domainesACouvrirValue,
                disponibilites: disponibilitesValue,
                raison: implicationMessage
            },
            connaissance: connaissance
        }

        sanityClient.create(dataToSend)
            .then(response => {
                console.log(response);
                setLoading(false)
            })
            .catch(err => {
                console.error("Error creating document: ", err);
                if(err.statusCode === 403) {
                    alert("You do not have permission to submit this form")
                } else {
                    alert("An error occurred while submitting the form. Please try again later.")
                }
            })

    }

    return (
        <div className="flex flex-col w-3/5 m-auto bg-custom-beige p-10 rounded-2xl border-black border-4 overflow-hidden">
            <Typography as={"h1"} className={typographyTheme({ size: 'h1' })}>Bienvenue parmis nous!</Typography>
            <form className={`flex flex-col`} onSubmit={handleSubmit}>
                <Field className="flex flex-col">
                    <Label htmlFor="nom" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Nom</Label>
                    <Input type="text" id="nom" name="nom" value={clerkNom} className={`${inputTheme({ lowPadding: true, readOnly: true })}`} readOnly />
                </Field>

                <Field className="flex flex-col">
                    <Label htmlFor="nom_famille" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Nom de famille</Label>
                    <Input type="text" id="nom_famille" name="nom_famille" value={clerkNom_famille} className={`${inputTheme({ lowPadding: true, readOnly: true })}`} readOnly />
                </Field>

                <Field className="flex flex-col">
                    <Label htmlFor="email" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Adresse courriel</Label>
                    <Input type="email" id="email" name="email" value={clerkEmail} className={`${inputTheme({ lowPadding: true, readOnly: true })}`} readOnly />
                </Field>

                <Field className="flex flex-col">
                    <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Code postal</Label>
                    <Input type="text" name="code_postal" id="code_postal" className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => setCodePostal(e.target.value)}/>
                </Field>

                <div>
                    <DynamicInputList
                        label="Téléphone"
                        name="telephone"
                        fields={[
                            {
                                type: "select",
                                name: "type",
                                placeholder: "Type de téléphone",
                                options: [
                                    { value: "home", label: "Domicile" },
                                    { value: "cell", label: "Cellulaire" },
                                    { value: "work", label: "Travail" },
                                    { value: "other", label: "Autre" } ]
                            },
                            { type: "text", name: "number", placeholder: "Numéro de téléphone" }
                        ]}
                        onChange={handlePhoneNumberChange}
                    />
                </div>

                <Typography as={"h3"} className={typographyTheme({ size: 'h3' })}>Information sur la famille</Typography>

                <Field className="flex flex-col">
                    <Label htmlFor="occupation" id="occupation" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Occupation</Label>
                    <Listbox value={occupation} onChange={setOccupation}>
                        <ListboxButton className={listBoxTheme({ lowPadding: true })}>{occupation.name}</ListboxButton>
                        <ListboxOptions className={listBoxOptionsTheme()} anchor="bottom">
                            {occupationOptions.map((option) => (
                                <ListboxOption key={option.id} value={option} className={listBoxOptionTheme()}>
                                    {option.name}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </Field>

                <Field className="flex flex-col">
                    <Label htmlFor="revenus" id="revenue" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Revenus familiaux</Label>
                    <Listbox value={revenus} onChange={setRevenus}>
                        <ListboxButton className={listBoxTheme({ lowPadding: true })}>{revenus.name}</ListboxButton>
                        <ListboxOptions className={listBoxOptionsTheme()} anchor="bottom">
                            {revenusOptions.map((option) => (
                                <ListboxOption key={option.id} value={option} className={listBoxOptionTheme()}>
                                    {option.name}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </Field>

                <Field className="flex flex-col">
                    <Label htmlFor="date_naissance" id="date_naissance" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Date de naissance</Label>
                    <Input type="date" name="date_naissance" id="date_naissance" className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => setDateNaissance(e.target.value)}/>
                </Field>

                <Field className="flex flex-col">
                    <Label htmlFor="langue_principale" id="langue_principale" className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Langue principale parlée à la maison</Label>
                    <Input type="text" name="langue_principale" id="langue_principale" className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => setLanguePrincipale(e.target.value)}/>
                </Field>

                <div>
                    <DynamicInputList
                        fields={[
                            { type: "text", name: "langue_secondaire", placeholder: "Langue seconde" }
                        ]}
                        label="Langue(s) seconde(s) parlée à la maison"
                        name={"langues_secondaires"}
                        onChange={handleLanguesSecondairesChange}
                    />
                </div>

                <Field className="flex flex-col">
                    <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Statut familial</Label>
                    <Listbox value={statutFamilial} onChange={setStatutFamilial}>
                        <ListboxButton className={listBoxTheme({ lowPadding: true })}>{statutFamilial.name}</ListboxButton>
                        <ListboxOptions className={listBoxOptionsTheme()} anchor="bottom">
                            {statutFamilialOptions.map((option) => (
                                <ListboxOption key={option.id} value={option} className={listBoxOptionTheme()}>
                                    {option.name}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </Field>

                <Field className="flex flex-col">
                    <DynamicInputList
                        label="Membres de la famille"
                        name="family_members"
                        vertical={true}
                        fields={[
                            { type: "text", name: "nom", placeholder: "Prénom" },
                            { type: "text", name: "nom_famille", placeholder: "Nom de famille" },
                            { type: "date", name: "age", placeholder: "Date de naissance" },
                            {
                                type: "select", name: "genre", placeholder: "Genre", options: [
                                    { value: "homme", label: "Homme" },
                                    { value: "femme", label: "Femme" },
                                    { value: "autre", label: "Autre" },
                                    { value: "no_answer", label: "Préfère ne pas répondre" }
                                ]
                            },
                            {
                                type: "select", name: "familyLink", placeholder: "Lien de parenté", options: [
                                    { label: 'Père', value: 'pere' },
                                    { label: 'Mère', value: 'mere' },
                                    { label: 'Conjoint(e)', value: 'conjoint' },
                                    { label: 'Grand-père', value: 'grand-pere' },
                                    { label: 'Grand-mère', value: 'grand-mere' },
                                    { label: 'Fils', value: 'fils' },
                                    { label: 'Fille', value: 'fille' },
                                    { label: 'Neveu', value: 'neveu' },
                                    { label: 'Nièce', value: 'niece' },
                                    { label: 'Oncle', value: 'oncle' },
                                    { label: 'Tante', value: 'tante' },
                                    { label: 'Ne sais pas', value: 'no_idea' },
                                    { label: "Préfère ne pas répondre", value: "no_answer" }
                                ]
                            }
                        ]}
                        onChange={handleFamilyMembersChange}
                    />
                </Field>

                <Field className="flex flex-col">
                    <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Nombre de personnes composant la famille immédiate</Label>
                    <Input type="number" name="immediate_family" id="immediate_family" className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => setImmediateFamily(Number(e.target.value))}/>
                </Field>

                <Typography as={"h3"} className={typographyTheme({ size: "h3" })}>Êtes-vous intéressé à faire du bénévolat?</Typography>
                <div className="flex flex-row items-center">
                    <Typography as={"p"} className={typographyTheme({ size: "paragraph" })}>Oui, je suis intéressé!</Typography>
                    <Checkbox
                        checked={benevolatCheckEnabled}
                        onChange={setBenevolatCheckEnabled}
                        className="block place-items-center size-4 rounded border-2 border-black mx-4 p-4 bg-white data-[checked]:bg-blue-500"
                    >
                        {benevolatCheckEnabled && <FaCheck size={25} />}
                    </Checkbox>

                </div>
                <Typography as={"p"} className={typographyTheme({ size: "footnote" })}>Laisser vide si non</Typography>

                {benevolatCheckEnabled &&
                    <Fieldset>
                        <Legend className={`${formLabelTheme()} ${typographyTheme({ size: 'h3' })}`}>Formulaire de bénévolat</Legend>
                        <Field className="flex flex-col">
                            <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Domaines à couvrir</Label>
                            {
                                domainesACouvrir.map((domaine) => (
                                    <div key={domaine.id} className="flex flex-row items-center gap-2">
                                        <Label htmlFor={`choice${domaine.id}`}>{domaine.name}</Label>
                                        <Input type="checkbox" id={`choice${domaine.id}`} name={domaine.name} value={domaine.value} className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => handleDomainesACouvrirChange(e.target.value)} />
                                    </div>
                                ))
                            }
                        </Field>

                        <Field className="flex flex-col">
                            <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Disponibilités</Label>
                            {
                                benevolatDispo.map((dispo) => (
                                    <div key={dispo.id} className="flex flex-row items-center gap-2">
                                        <Label htmlFor={`dispo${dispo.id}`}>{dispo.name}</Label>
                                        <Input type="checkbox" id={`dispo${dispo.id}`} name={dispo.name} value={dispo.value} className={`${inputTheme({ lowPadding: true })}`} onChange={(e) => handleDisponibiliteChange(e.target.value)} />
                                    </div>
                                ))
                            }
                        </Field>

                        <Field className="flex flex-col">
                            <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Pourquoi je veux m&apos;impliquer comme bénévole</Label>
                            <textarea name="raison" onChange={(e) => setImplicationMessage(e.target.value)}/>
                        </Field>
                    </Fieldset>
                }

                <Field className="flex flex-col">
                    <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>Comment avez vous entendu parlé de la Maison de la Famille?</Label>
                    <Listbox value={connaissance} onChange={setConnaissance} >
                        <ListboxButton className={listBoxTheme({ lowPadding: true })}>Choisir une option</ListboxButton>
                        <ListboxOptions className={listBoxOptionsTheme()} anchor="bottom">
                            {raisonConnaissance.map((raison) => (
                                <ListboxOption key={raison.id} value={raison.value} className={listBoxOptionTheme()}>{raison.name}</ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </Field>

                <MFButton style="smallbg" type="submit" extraCSS="w-1/3 ml-auto rounded-xl" _type={"button"}>{loading ? "En cours d'envoi" : "Soumettre"}</MFButton>
            </form>
        </div>
    );
}
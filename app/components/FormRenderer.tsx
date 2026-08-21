/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import { Formulaires } from '@/sanity.types';
import type { ActivityPaymentContext } from '@/app/types/payments';
import { useAuth } from '../AuthContext';
import MFButton from './MFButton';
import MFLink from './MFLink';
import PaymentForm from './forms/PaymentForm';
import Typography from './Typography/Typography';
import typographyTheme from './theme/Typography';

export type FormSectionType = NonNullable<Formulaires["sections"]>[number]["_type"] | 'formButton';
export type FormSubmissions = NonNullable<Formulaires["submissions"]>[number];

export interface FormSection {
    _type: FormSectionType;
    label?: string;
    title?: string;
    options?: string[];
    multiSelect?: boolean;
    triggerValue?: string;
    revealedFields?: FormSection[];
    _key?: string;
}

const components: { [key in FormSection['_type'] | 'formButton']: any } = {
    textField: dynamic(() => import('./forms/components/TextInput')),
    checkboxField: dynamic(() => import('./forms/components/CheckboxFields')),
    radioField: dynamic(() => import('./forms/components/RadioField')),
    dropdownField: dynamic(() => import('./forms/components/DropdownField')),
    dateField: dynamic(() => import('./forms/components/DateField')),
    conditionalField: dynamic(() => import('./forms/components/ConditionalField')),
    largeTitle: dynamic(() => import('./Typography/Typography')),
    mediumTitle: dynamic(() => import('./Typography/Typography')),
    smallTitle: dynamic(() => import('./Typography/Typography')),
    button: dynamic(() => import('./MFButton')),
    formButton: dynamic(() => import('./FormModalButton')),
};

interface FormRendererProps {
    formTitle?: string;
    formDesc?: string;
    sections: FormSection[];
    formRef?: string;
    activite?: ActivityPaymentContext;
    requireMember?: boolean;
    onSubmit?: (submission: FormSubmissionPayload) => Promise<void>;
    onFieldChange?: (section: FormSection, value: any) => void;
    beforeSubmit?: ReactNode;
    submitDisabled?: boolean;
    successMessage?: string;
    errorMessage?: string;
}

export interface FormSubmissionPayload {
    answers: Record<string, FormDataEntryValue | FormDataEntryValue[]>;
    submission: FormSubmissions;
}

const updateSubmissions = async (
    ref: string | undefined,
    newSubmission: FormSubmissions,
    activityId?: string,
    paymentIntentId?: string | null,
) => {
    if (!ref) throw new Error("The form reference is missing.");

    const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            formId: ref,
            activityId: activityId ?? null,
            paymentIntentId: paymentIntentId ?? null,
            selectedDate: newSubmission.selectedDate ?? null,
            answers: newSubmission.answers?.map((answer) => ({
                question: answer.question ?? '',
                response: answer.response ?? '',
            })) ?? [],
        }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "The form submission could not be saved.");
    }
};

export default function FormRenderer({
    formTitle,
    formDesc,
    sections,
    formRef,
    activite,
    requireMember = true,
    onSubmit,
    onFieldChange,
    beforeSubmit,
    submitDisabled = false,
    successMessage = 'Formulaire envoyé avec succès!',
    errorMessage = 'Une erreur est survenue lors de l’envoi du formulaire.',
}: FormRendererProps) {
    const { sanityMember } = useAuth();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [selectedActivityDate, setSelectedActivityDate] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    const stripeProduct = activite?.produitStripe;
    const paymentRequired = Boolean(stripeProduct);
    const activityHasOpenDates = activite
        ? Boolean(activite.dates?.some((entry) =>
            entry.date &&
            entry.inscriptionOuverte &&
            entry.isVisible &&
            (!entry.openDate || new Date(entry.openDate) <= new Date())
        ))
        : true;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (paymentRequired && (!isPaid || !transactionId)) {
            setStatus('error');
            return;
        }

        const formData = new FormData(event.currentTarget);
        const groupedData: Record<string, any> = {};

        formData.forEach((value, key) => {
            const baseKey = key.replace(/-\d+$/, '');
            if (groupedData[baseKey]) {
                groupedData[baseKey] = Array.isArray(groupedData[baseKey])
                    ? [...groupedData[baseKey], value]
                    : [groupedData[baseKey], value];
            } else {
                groupedData[baseKey] = value;
            }
        });

        const newSubmission: FormSubmissions = {
            _type: "submission",
            _key: crypto.randomUUID(),
            submittedAt: new Date().toISOString(),
            ...(sanityMember?._id ? { user: { _ref: sanityMember._id, _type: "reference" } } : {}),
            selectedDate: selectedActivityDate || groupedData["selectedDate"] || null,
            answers: Object.entries(groupedData).map(([question, response]) => ({
                _type: "answer",
                _key: crypto.randomUUID(),
                question,
                response: String(Array.isArray(response) ? response.join(', ') : response),
            })),
        };

        setStatus('submitting');
        try {
            if (onSubmit) {
                await onSubmit({ answers: groupedData, submission: newSubmission });
            } else {
                await updateSubmissions(formRef, newSubmission, activite?._id, transactionId);
            }
            event.currentTarget.reset();
            setStatus('success');
        } catch (error) {
            console.error("Erreur lors de l’envoi du formulaire:", error);
            setStatus('error');
        }
    };

    if (requireMember && sanityMember === null) {
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <Typography as="h3" className={typographyTheme({ size: 'h3' })}>
                    Connecte-toi ou inscris-toi comme membre pour accéder à ce formulaire.
                </Typography>
                <div className='flex flex-col justify-center items-center m-auto my-6'>
                    <SignedIn>
                        <MFLink _type='button' link='/account' style="coloredbg" extraCSS="m-auto">
                            Accède à ton compte pour devenir membre
                        </MFLink>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <MFButton _type='button' style="coloredbg" extraCSS="m-auto">Inscris-toi</MFButton>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            {formTitle && <Typography as="h2" className={typographyTheme({ size: "h2" })}>{formTitle}</Typography>}
            {formDesc && <Typography as="p" className={typographyTheme({ size: "h5" })}>{formDesc}</Typography>}

            {sections.map((section) => {
                const Component = components[section._type];
                if (!Component) return null;

                if (section._type === 'largeTitle') {
                    return <Typography key={section._key} as="h1" className={typographyTheme({ size: 'h1' })}>{section.title}</Typography>;
                }
                if (section._type === 'mediumTitle') {
                    return <Typography key={section._key} as="h2" className={typographyTheme({ size: 'h3' })}>{section.title}</Typography>;
                }
                if (section._type === 'smallTitle') {
                    return <Typography key={section._key} as="h3" className={typographyTheme({ size: 'h5' })}>{section.title}</Typography>;
                }

                return (
                    <Component
                        key={section._key}
                        {...section}
                        activityDates={section._type === 'dateField' ? activite?.dates : undefined}
                        onChange={(value: any) => {
                            if (section._type === 'dateField') setSelectedActivityDate(String(value));
                            onFieldChange?.(section, value);
                        }}
                    />
                );
            })}

            {stripeProduct && (
                isPaid ? (
                    <p role="status">Paiement complété avec succès.</p>
                ) : (
                    <PaymentForm
                        setIsPaid={setIsPaid}
                        setTransactionId={setTransactionId}
                        sanityProductId={stripeProduct._id}
                        activityId={activite?._id}
                        disabled={Boolean(activite?.dates?.length) && !selectedActivityDate}
                    />
                )
            )}

            {beforeSubmit}

            <p className="text-sm">
                Les renseignements fournis servent à traiter votre adhésion ou votre inscription. Consultez
                notre <a href="/confidentialite" className="underline">politique de confidentialité</a>.
            </p>

            <MFButton
                type="submit"
                style="coloredbg"
                _type="button"
                disabled={
                    status === 'submitting' ||
                    submitDisabled ||
                    !activityHasOpenDates ||
                    (paymentRequired && (!isPaid || !transactionId))
                }
            >
                {status === 'submitting' ? 'En cours d’envoi' : 'Soumettre'}
            </MFButton>
            {status === 'success' && <p role="status">{successMessage}</p>}
            {status === 'error' && <p role="alert">{errorMessage}</p>}
        </form>
    );
}

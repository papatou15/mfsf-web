/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';
import Typography from './Typography/Typography';
import typographyTheme from './theme/Typography';
import { Formulaires } from '@/sanity.types';
import MFButton from './MFButton';
import { sanityClient } from '../sanityClient';

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
}

const updateSubmissions = async (ref: string | undefined, newSubmission: any) => {
    try {
        if (!ref) {
            console.error("❌ Error: formRef is undefined.");
            return;
        }

        const updatedDoc = await sanityClient
            .patch(ref)
            .setIfMissing({ submissions: [] }) // Ensure `submissions` exists
            .append('submissions', [newSubmission]) // Add new entry
            .commit();

        console.log("✅ Submission added:", updatedDoc);
    } catch (error) {
        console.error("❌ Error updating submissions:", error);
    }
};

export default function FormRenderer({ formTitle, formDesc, sections, formRef }: FormRendererProps) {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const groupedData: Record<string, any> = {};

        formData.forEach((value, key) => {
            // Extract the base key by removing the '-X' index at the end
            const baseKey = key.replace(/-\d+$/, '');

            if (groupedData[baseKey]) {
                // If key already exists, push the new value into the array
                groupedData[baseKey] = Array.isArray(groupedData[baseKey])
                    ? [...groupedData[baseKey], value]
                    : [groupedData[baseKey], value];
            } else {
                // Otherwise, store it as the first value
                groupedData[baseKey] = value;
            }
        });

        console.log("Grouped data: ", groupedData);

        const newSubmission = {
            _type: "submission",
            _key: crypto.randomUUID(),
            submittedAt: new Date().toISOString(),
            // user: { _ref: "r48w", _type: "reference" },
            // activity: { _ref: "activity-id", _type: "reference" },
            selectedDate: groupedData["selectedDate"] || null,
            answers: Object.entries(groupedData).map(([question, response]) => ({
                _type: "answer",
                _key: crypto.randomUUID(),
                question,
                response: Array.isArray(response) ? response.join(', ') : response, // Handle checkboxes
            })),
        };

        console.log("New submission: ", newSubmission);

        await updateSubmissions(formRef, newSubmission)
    };

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

                return <Component key={section._key} {...section} />;
            })}

            <MFButton type="submit" style="coloredbg" _type={'button'}>Soumettre</MFButton>
        </form>
    );
}

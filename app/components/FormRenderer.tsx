/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';
import Typography from './Typography/Typography';
import typographyTheme from './theme/Typography';

export interface FormSection {
    _type: 'textField' | 'checkboxField' | 'radioField' | 'dropdownField' | 'dateField' | 'conditionalField';
    label?: string;
    options?: string[];
    multiSelect?: boolean;
    triggerValue?: string; 
    revealedFields?: FormSection[];
    _key?: string;
}

const components: { [key in FormSection['_type']]: any } = {
    textField: dynamic(() => import('./forms/components/TextInput')),
    checkboxField: dynamic(() => import('./forms/components/CheckboxFields')),
    radioField: dynamic(() => import('./forms/components/RadioField')),
    dropdownField: dynamic(() => import('./forms/components/DropdownField')),
    dateField: dynamic(() => import('./forms/components/DateField')),
    conditionalField: dynamic(() => import('./forms/components/ConditionalField')),
};

interface FormRendererProps {
    formTitle?: string;
    formDesc?: string;
    sections: FormSection[];
    onSubmit: (data: any) => void;
}

export default function FormRenderer({ formTitle, formDesc, sections, onSubmit }: FormRendererProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formTitle && <Typography as="h2" className={typographyTheme({size: "h2"})}>{formTitle}</Typography>}
            {formDesc && <Typography as="p" className={typographyTheme({size: "h2"})}>{formDesc}</Typography>}

            {sections.map((section) => {
                const Component = components[section._type];

                if (!Component) return null;

                return <Component key={section._key} {...section} />;
            })}

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </form>
    );
}

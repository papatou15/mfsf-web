import { Fieldset, Input, Label } from '@headlessui/react';
import { useState } from 'react';
import { CheckboxField as CheckboxFieldSanity } from '@/sanity.types';
import formLabelTheme from '../../theme/FormLabel';

interface CheckboxFieldProps extends CheckboxFieldSanity {
    _key: string;
    onChange?: (value: string[]) => void;
}

export default function CheckboxField({ label, options, _key, _type, onChange }: CheckboxFieldProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleCheckboxChange = (option: string) => {
        setSelectedOptions((prev) => {
            const newSelection = prev.includes(option)
                ? prev.filter((item) => item !== option) // Remove if already selected
                : [...prev, option]; // Add if not selected

            onChange?.(newSelection); // Notify parent form
            return newSelection;
        });
    };

    return (
        <Fieldset key={_key} className={`${_type}`}>
            <Label className={formLabelTheme({ size: "small", margin: "small"})}>{label}</Label>
            <div className="space-y-2">
                {options?.map((option, index) => (
                    <div key={option} className="flex items-center gap-2">
                        <Input
                            type="checkbox"
                            id={`${label}-${option}`}
                            name={`${label}-${index}`}
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="w-7 h-7 rounded border-2 border-black border-solid"
                        />
                        <Label htmlFor={`${option}-${_key}`}>{option}</Label>
                    </div>
                ))}
            </div>
        </Fieldset>
    );
}

import { useState } from "react";
import { Field, Input, Label, Select } from "@headlessui/react";
import MFButton from "../../MFButton";
import formLabelTheme from "../../theme/FormLabel";
import typographyTheme from "../../theme/Typography";
import inputTheme from "../../theme/Input";

interface Option {
    value: string;
    label: string;
}

interface Field {
    type: "text" | "date" | "select";
    name: string;
    placeholder?: string;
    options?: Option[];
}

interface DynamicInputListProps {
    label: string;
    name: string;
    fields: Field[];
    initialValues?: Record<string, string>[];
    onChange?: (values: Record<string, string>[]) => void;
    vertical?: boolean
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ label, name, fields, initialValues, onChange, vertical }) => {
    const [inputs, setInputs] = useState<Record<string, string>[]>(
        initialValues && initialValues.length > 0 ? initialValues : [{}]
    );

    const handleChange = (index: number, fieldName: string, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = { ...newInputs[index], [fieldName]: value };
        setInputs(newInputs);
        if (onChange) onChange(newInputs)
    };

    const addInput = () => {
        const newInputs = [...inputs, {}];
        setInputs(newInputs);
        if (onChange) onChange(newInputs)
    };

    const removeInput = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
        if (onChange) onChange(newInputs)
    };

    return (
        <Field className="flex flex-col gap-2">
            <Label className={`${formLabelTheme()} ${typographyTheme({ size: 'h5' })}`}>{label}</Label>
            {inputs.map((input, index) => (
                <div key={index} className="flex flex-row items-center">
                    <div className={`flex ${vertical ? "flex-col" : 'flex-row'} gap-2 border-l-2 border-black p-3`}>
                        {fields.map((field) => (
                            <div key={field.name} className="flex items-center gap-2">
                                {field.type === "select" ? (
                                    <Select
                                        name={`${name}[${index}][${field.name}]`}
                                        value={input[field.name] || ""}
                                        onChange={(e) => handleChange(index, field.name, e.target.value)}
                                        className={`${inputTheme({ lowPadding: true })} ${typographyTheme({ size: 'paragraph' })}`}
                                    >
                                        <option value="">Choisir une valeur: {field.placeholder}</option>
                                        {field.options?.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Input
                                        type={field.type}
                                        name={`${name}[${index}][${field.name}]`}
                                        value={input[field.name] || ""}
                                        placeholder={field.placeholder}
                                        className={`${inputTheme({ lowPadding: true })}`}
                                        onChange={(e) => handleChange(index, field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                    </div>
                    {index > 0 && (
                        <MFButton _type="button" style={"smallbg"} onClick={() => removeInput(index)}>
                            ✖
                        </MFButton>
                    )}
                </div>

            ))}
            <MFButton _type="button" style={"smallbg"} onClick={addInput}>+ Ajouter un champ</MFButton>
        </Field>
    );
};

export default DynamicInputList;

import { useState } from "react";
import { Field, Input, Label, Select } from "@headlessui/react";
import MFButton from "../../MFButton";

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
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ label, name, fields, initialValues, onChange }) => {
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
        <div className="flex flex-col gap-2">
            <Field>
                <Label className="font-medium">{label}</Label>
                {inputs.map((input, index) => (
                    <div key={index} className="flex flex-col gap-2 border p-3 rounded-md">
                        {fields.map((field) => (
                            <div key={field.name} className="flex items-center gap-2">
                                {field.type === "select" ? (
                                    <Select
                                        name={`${name}[${index}][${field.name}]`}
                                        value={input[field.name] || ""}
                                        onChange={(e) => handleChange(index, field.name, e.target.value)}
                                    >
                                        <option value="">Select {field.placeholder}</option>
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
                                        onChange={(e) => handleChange(index, field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        {index > 0 && (
                            <MFButton _type="button" style={"smallbg"} onClick={() => removeInput(index)}>
                                ✖
                            </MFButton>
                        )}
                    </div>
                ))}
                <MFButton _type="button" style={"smallbg"} onClick={addInput}>+ Add Another</MFButton>
            </Field>

        </div>
    );
};

export default DynamicInputList;

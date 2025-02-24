import { Field, Label } from '@headlessui/react';
import { useState } from 'react';

export default function CheckboxField({ label, name, options }: { label: string; name: string; options: string[] }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    <Field>
      <Label>{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={option}
              name={`${name}[]`}
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="w-5 h-5 rounded border"
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </div>
    </Field>
  );
}

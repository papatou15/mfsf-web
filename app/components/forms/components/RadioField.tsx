import { Field, Label, RadioGroup, Radio } from '@headlessui/react';

export default function RadioField({ label, options }: { label: string; name: string; options: string[] }) {
  return (
    <Field>
      <Label>{label}</Label>
      <RadioGroup className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Radio id={option} value={option} className="w-5 h-5 rounded-full border" />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </Field>
  );
}

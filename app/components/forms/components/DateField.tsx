import { Field, Label } from '@headlessui/react';

export default function DateField({ label, name }: { label: string; name: string }) {
  return (
    <Field>
      <Label htmlFor={name}>{label}</Label>
      <input id={name} name={name} type="date" className="border p-2 rounded-md w-full" />
    </Field>
  );
}

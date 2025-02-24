import { Field, Label, Input } from '@headlessui/react';

export default function TextField({ label, name }: { label: string; name: string }) {
  return (
    <Field>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="text" className="border p-2 rounded-md w-full" />
    </Field>
  );
}

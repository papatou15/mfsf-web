import { Field, Label } from '@headlessui/react';
import { DateField as DateFieldSanity } from '@/sanity.types';

interface DateFieldProps extends DateFieldSanity {
  _key: string;
}

export default function DateField({ label, _key, _type, required }: DateFieldProps) {
  return (
    <Field className={`${_type}`}>
      <Label htmlFor={label}>{label}</Label>
      <input id={_key} name={label} type="date" required={required} className="border p-2 rounded-md w-full" />
    </Field>
  );
}

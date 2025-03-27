import { Field, Label, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useState } from 'react';
import { DropdownField as DropdownFieldSanity } from '@/sanity.types';

interface DropdownFieldProps extends DropdownFieldSanity {
  _key: string;
}

export default function DropdownField({ label, options, _key, _type }: DropdownFieldProps) {
  const [selected, setSelected] = useState(options?.[0]);

  return (
    <Field key={_key} className={`${_type}`}>
      <Label>{label}</Label>
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton className="border p-2 rounded-md w-full">{selected}</ListboxButton>
        <ListboxOptions className="border rounded-md bg-white shadow-lg mt-2">
          {options?.map((option) => (
            <ListboxOption key={option} value={option} className="p-2 hover:bg-gray-100 cursor-pointer">
              {option}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <input type="hidden" name={`${label}`} value={selected} />
    </Field>
  );
}

import { Field, Label, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useState } from 'react';

export default function DropdownField({ label, name, options }: { label: string; name: string; options: string[] }) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <Field>
      <Label>{label}</Label>
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton className="border p-2 rounded-md w-full">{selected}</ListboxButton>
        <ListboxOptions className="border rounded-md bg-white shadow-lg mt-2">
          {options.map((option) => (
            <ListboxOption key={option} value={option} className="p-2 hover:bg-gray-100 cursor-pointer">
              {option}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <input type="hidden" name={name} value={selected} />
    </Field>
  );
}

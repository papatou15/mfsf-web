/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Label, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useState } from 'react';
import FormRenderer from '../../FormRenderer';

export default function ConditionalField({ label, options, triggerValue, revealedFields }: any) {
  const [selected, setSelected] = useState(options[0]);
  const [showFields, setShowFields] = useState(false);

  return (
    <Field>
      <Label>{label}</Label>
      <Listbox value={selected} onChange={(value) => {
        setSelected(value);
        setShowFields(value === triggerValue);
      }}>
        <ListboxButton className="border p-2 rounded-md w-full">{selected}</ListboxButton>
        <ListboxOptions className="border rounded-md bg-white shadow-lg mt-2">
          {options.map((option: string) => (
            <ListboxOption key={option} value={option} className="p-2 hover:bg-gray-100 cursor-pointer">
              {option}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {showFields && <FormRenderer sections={revealedFields} onSubmit={() => {}} />}
    </Field>
  );
}

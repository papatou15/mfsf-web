"use client"

import { Label, RadioGroup, Radio, Fieldset, Legend, Field } from '@headlessui/react';
import { RadioField as RadioFieldSanity } from '@/sanity.types';
import { useState } from 'react';

interface RadioFieldProps extends RadioFieldSanity {
  _key: string;
}

export default function RadioField({ label, options, _key, _type }: RadioFieldProps) {
  const [selected, setSelected] = useState(options?.[0]);

  return (
    <Fieldset key={_key} className={`${_type}`}>
      <Legend>{label}</Legend>
      <RadioGroup name={label} value={selected} onChange={setSelected} className="space-y-2">
        {options?.map((option) => (
          <Field key={option} className="flex items-center gap-2">
            <Radio id={`${option} ${_key}`} value={option} className="w-5 h-5 rounded-full border bg-off-white data-[checked]:bg-primary-blue transition-all duration-150 " />
            <Label htmlFor={option}>{option}</Label>
          </Field>
        ))}
      </RadioGroup>
    </Fieldset>
  );
}

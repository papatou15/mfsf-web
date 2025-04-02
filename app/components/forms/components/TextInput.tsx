"use client"

import { Field, Label, Input } from '@headlessui/react';
import inputTheme from '../../theme/Input';
import { TextField as TextFieldSanity } from '@/sanity.types';
import formLabelTheme from '../../theme/FormLabel';
import { useState } from 'react';

interface TextFieldProps extends TextFieldSanity {
  _key: string;
}

export default function TextField({ _type, label, placeholder, _key}: TextFieldProps) {
  const [value, setValue] = useState<string>('');

  return (
    <Field className={`${_type} flex flex-col`}>
      <Label className={formLabelTheme({ size: 'small', margin: 'small'})}>{label}</Label>
      <Input
        id={_key}
        type="text"
        value={value}
        name={label}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputTheme({ lowPadding: true })} bg-off-white`}
        placeholder={placeholder}
      />
    </Field>
  );
}

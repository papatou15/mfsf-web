import { Field, Label } from '@headlessui/react';
import { DateField as DateFieldSanity } from '@/sanity.types';

import type { ActivityDateSummary } from '@/app/types/payments';

interface DateFieldProps extends DateFieldSanity {
  _key: string;
  activityDates?: ActivityDateSummary[];
  onChange?: (value: string) => void;
}

export default function DateField({ label, _key, _type, required, activityDates, onChange }: DateFieldProps) {
  const availableDates = activityDates?.filter((entry) =>
    entry.date &&
    entry.inscriptionOuverte &&
    entry.isVisible &&
    (!entry.openDate || new Date(entry.openDate) <= new Date())
  ) ?? [];

  return (
    <Field className={`${_type}`}>
      <Label htmlFor={_key}>{label}</Label>
      {activityDates ? (
        <select
          id={_key}
          name="selectedDate"
          required={required}
          defaultValue=""
          onChange={(event) => onChange?.(event.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="" disabled>Choisir une date</option>
          {availableDates.map((entry) => (
            <option key={entry.date} value={entry.date}>
              {new Date(`${entry.date}T00:00:00`).toLocaleDateString('fr-CA')}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={_key}
          name={label}
          type="date"
          required={required}
          onChange={(event) => onChange?.(event.target.value)}
          className="border p-2 rounded-md w-full"
        />
      )}
      {activityDates && availableDates.length === 0 && (
        <p role="status">Aucune date d’inscription n’est ouverte pour le moment.</p>
      )}
    </Field>
  );
}

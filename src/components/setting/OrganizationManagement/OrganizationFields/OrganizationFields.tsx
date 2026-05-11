import { Input } from '@/components/ui';
import { Field } from '../Field/Field';
import { ORGANIZATION_DETAILS_FIELDS } from '../constants';
import type { OrganizationFormKey } from '../types';
import styles from './OrganizationFields.module.css';

export function OrganizationFields({
  values,
  onChange,
}: {
  values: Record<OrganizationFormKey, string>;
  onChange: (field: OrganizationFormKey, value: string) => void;
}) {
  return (
    <>
      {ORGANIZATION_DETAILS_FIELDS.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          icon={<field.icon className={styles.fieldIcon} />}
        >
          {field.kind === 'textarea' ? (
            <textarea
              value={values[field.field]}
              onChange={(e) => onChange(field.field, e.target.value)}
              className={styles.textareaField}
              placeholder="Organization description"
              rows={4}
            />
          ) : (
            <Input
              type={
                field.field === 'contact_email'
                  ? 'email'
                  : field.field === 'website_url'
                    ? 'url'
                    : 'text'
              }
              value={values[field.field]}
              onChange={(e) => onChange(field.field, e.target.value)}
              className={styles.inputField}
              placeholder={
                field.field === 'website_url'
                  ? 'https://example.com'
                  : field.label.toLowerCase()
              }
            />
          )}
        </Field>
      ))}
    </>
  );
}

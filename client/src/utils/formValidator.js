import {
  LF_LOGIN_INPUT_ID,
  LF_PASSWORD_INPUT_ID,
  RF_LOGIN_INPUT_ID,
  RF_NAME_INPUT_ID,
  RF_PASSWORD_INPUT_ID,
  RF_PASSWORD_REPEATED_INPUT_ID,
} from '../scripts/Form';

export const handleValidateInput = (formData) => {
  const errors = [];
  const warnings = [];

  const passRegex =
    /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,20}$/;

  if (
    (formData[LF_LOGIN_INPUT_ID] !== undefined && formData[LF_LOGIN_INPUT_ID].trim().length < 3) ||
    (formData[RF_LOGIN_INPUT_ID] !== undefined && formData[RF_LOGIN_INPUT_ID].trim().length < 3)
  ) {
    formData[LF_LOGIN_INPUT_ID] !== undefined
      ? errors.push({ [LF_LOGIN_INPUT_ID]: 'Login musi posiadać min. 3 znaki' })
      : errors.push({ [RF_LOGIN_INPUT_ID]: 'Login musi posiadać min. 3 znaki' });
  } else if (
    (formData[LF_LOGIN_INPUT_ID] !== undefined && formData[LF_LOGIN_INPUT_ID].includes(' ')) ||
    (formData[RF_LOGIN_INPUT_ID] !== undefined && formData[RF_LOGIN_INPUT_ID].includes(' '))
  ) {
    formData[LF_LOGIN_INPUT_ID] !== undefined
      ? errors.push({ [LF_LOGIN_INPUT_ID]: 'Login nie może zawierać spacji' })
      : errors.push({ [RF_LOGIN_INPUT_ID]: 'Login nie może zawierać spacji' });
  }

  if (
    (formData[LF_LOGIN_INPUT_ID] !== undefined && formData[LF_LOGIN_INPUT_ID].length === 15) ||
    (formData[RF_LOGIN_INPUT_ID] !== undefined && formData[RF_LOGIN_INPUT_ID].length === 15)
  ) {
    formData[LF_LOGIN_INPUT_ID] !== undefined
      ? warnings.push({ [LF_LOGIN_INPUT_ID]: 'Osiągnięto maksymalną liczbę znaków' })
      : warnings.push({ [RF_LOGIN_INPUT_ID]: 'Osiągnięto maksymalną liczbę znaków' });
  }

  if (formData[RF_NAME_INPUT_ID] !== undefined) {
    if (formData[RF_NAME_INPUT_ID].trim().length < 3) {
      errors.push({ [RF_NAME_INPUT_ID]: 'Imię musi posiadać min. 3 znaki' });
    } else if (formData[RF_NAME_INPUT_ID].includes(' ')) {
      errors.push({ [RF_NAME_INPUT_ID]: 'Imię nie może zawierać spacji' });
    }

    if (formData[RF_NAME_INPUT_ID].length === 50) {
      warnings.push({ [RF_NAME_INPUT_ID]: 'Osiągnięto maksymalną liczbę znaków' });
    }
  }

  if (
    (formData[LF_PASSWORD_INPUT_ID] !== undefined &&
      !formData[LF_PASSWORD_INPUT_ID].match(passRegex)) ||
    (formData[RF_PASSWORD_INPUT_ID] !== undefined &&
      !formData[RF_PASSWORD_INPUT_ID].match(passRegex))
  ) {
    formData[LF_PASSWORD_INPUT_ID] !== undefined
      ? errors.push({
          [LF_PASSWORD_INPUT_ID]:
            'Hasło musi posiadać od 8 do 20 znaków oraz zawierać: min. 1 cyfrę, 1 małą i 1 dużą literę oraz 1 znak specjalny (np. *).',
        })
      : errors.push({
          [RF_PASSWORD_INPUT_ID]:
            'Hasło musi posiadać od 8 do 20 znaków oraz zawierać: min. 1 cyfrę, 1 małą i 1 dużą literę oraz 1 znak specjalny (np. *).',
        });
  } else if (
    (formData[LF_PASSWORD_INPUT_ID] !== undefined &&
      formData[LF_PASSWORD_INPUT_ID].includes(' ')) ||
    (formData[RF_PASSWORD_INPUT_ID] !== undefined && formData[RF_PASSWORD_INPUT_ID].includes(' '))
  ) {
    formData[LF_PASSWORD_INPUT_ID] !== undefined
      ? errors.push({ [LF_PASSWORD_INPUT_ID]: 'Hasło nie może zawierać spacji' })
      : errors.push({ [RF_PASSWORD_INPUT_ID]: 'Hasło nie może zawierać spacji' });
  } else if (
    formData[RF_PASSWORD_REPEATED_INPUT_ID] !== undefined &&
    formData[RF_PASSWORD_INPUT_ID] !== undefined &&
    formData[RF_PASSWORD_REPEATED_INPUT_ID] !== formData[RF_PASSWORD_INPUT_ID]
  ) {
    errors.push({ [RF_PASSWORD_INPUT_ID]: 'Hasła nie zgadzają się ze sobą' });
  }

  if (
    (formData[LF_PASSWORD_INPUT_ID] !== undefined &&
      formData[LF_PASSWORD_INPUT_ID].length === 20) ||
    (formData[RF_PASSWORD_INPUT_ID] !== undefined && formData[RF_PASSWORD_INPUT_ID].length === 20)
  ) {
    formData[RF_PASSWORD_INPUT_ID] !== undefined
      ? warnings.push({ [LF_PASSWORD_INPUT_ID]: 'Osiągnięto maksymalną liczbę znaków' })
      : warnings.push({ [RF_PASSWORD_INPUT_ID]: 'Osiągnięto maksymalną liczbę znaków' });
  }

  return { errors, warnings };
};

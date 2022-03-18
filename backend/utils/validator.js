const passRegex =
  /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,20}$/;

export const validateLoginInput = (login, password) => {
  const errors = [];
  if (typeof login !== 'string') {
    errors.push({ login: 'Nieprawidłowy format loginu' });
  } else if (login.trim().length < 3) {
    errors.push({ login: 'Login musi posiadać min. 3 znaki' });
  } else if (login.includes(' ')) {
    errors.push({ login: 'Login nie może zawierać spacji' });
  }

  if (typeof password !== 'string') {
    errors.push({ password: 'Nieprawidłowy format hasła' });
  } else if (!password.match(passRegex)) {
    errors.push({
      password:
        'Hasło musi posiadać od 8 do 20 znaków oraz zawierać: min. 1 cyfrę, 1 małą i 1 dużą literę oraz 1 znak specjalny (np. *).',
    });
  } else if (password.includes(' ')) {
    errors.push({ password: 'Hasło nie może zawierać spacji' });
  }

  return errors;
};

export const validateRegisterInput = (login, name, password, passwordRepeated) => {
  const errors = [];

  if (typeof name !== 'string') {
    errors.push({ name: 'Nieprawidłowy format imienia' });
  } else if (name.trim().length < 3) {
    errors.push({ name: 'Imię musi posiadać min. 3 znaki' });
  } else if (name.includes(' ')) {
    errors.push({ name: 'Imię nie może zawierać spacji' });
  }

  const loginErrors = validateLoginInput(login, password);
  loginErrors.forEach((error) => errors.push(error));

  if (typeof passwordRepeated !== 'string') {
    errors.push({ passwordRepeated: 'Nieprawidłowy format powtórzonego hasła' });
  } else if (!passwordRepeated.match(passRegex)) {
    errors.push({
      passwordRepeated:
        'Powtórzone hasło musi posiadać od 8 do 20 znaków oraz zawierać: min. 1 cyfrę, 1 małą i 1 dużą literę oraz 1 znak specjalny (np. *).',
    });
  } else if (passwordRepeated.includes(' ')) {
    errors.push({ passwordRepeated: 'Powtórzone hasło nie może zawierać spacji' });
  } else if (passwordRepeated !== password) {
    errors.push({ passwordRepeated: 'Hasła nie zgadzają się ze sobą' });
  }
  return errors;
};

export const validateGameLevel = (gameLevel) => {
  const errors = [];

  if (typeof gameLevel !== 'number') {
    errors.push({ gameLevel: 'Nieprawidłowy format poziomu gry' });
  }

  return errors;
};

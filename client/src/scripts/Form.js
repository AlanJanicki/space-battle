import { Common, HIDE, SHOW } from './Common';
import { menu } from './Menu';
import { modal } from './Modal';
import { User } from './User';

import axios from '../utils/axios';
import { handleValidateInput } from '../utils/formValidator';

export const DELETE_ACCOUNT_FORM_ID = 'js-delete-account-form';
const DELETE_ACCOUNT_SUBMIT_BUTTON_ID = 'js-delete-account-form-submit-button';
const FINISH_HTTP_REQUEST = 'finish';
export const FORM_ERROR_CLASS = 'form__error';
const FORM_INFO_CLASS = 'form__info';
const FORM_INFO_DELETE_ACCOUNT_CLASS = 'form__info--delete-account';
const FORM_PASSWORD_WARNING_ID = 'js-formPasswordWarning';
const FORM_WARNING_CLASS = 'form__warning';
const LOADING_SPINNER_CLASS = 'loading__spinner';
const LOGIN_FORM_ID = 'js-login-form';
export const LF_LOGIN_INPUT_ID = 'js-login-form-login-input';
export const LF_PASSWORD_INPUT_ID = 'js-login-form-password-input';
const LF_SUBMIT_BUTTON_ID = 'js-login-form-submit-button';
const REGISTER_FORM_ID = 'js-register-form';
export const RF_LOGIN_INPUT_ID = 'js-register-form-login-input';
export const RF_NAME_INPUT_ID = 'js-register-form-name-input';
export const RF_PASSWORD_INPUT_ID = 'js-register-form-password-input';
export const RF_PASSWORD_REPEATED_INPUT_ID = 'js-register-form-passwordRepeated-input';
const RF_SUBMIT_BUTTON_ID = 'js-register-form-submit-button';
const SERVER_ERROR_LOGIN = 'login';
const SERVER_ERROR_NAME = 'name';
const SERVER_ERROR_PASSWORD = 'password';
const SERVER_ERROR_PASSWORD_REPEATED = 'passwordRepeated';
const SERVER_ERROR_UNCATEGORIZED_ERRORS = 'uncategorizedErrors';
const START_HTTP_REQUEST = 'start';

class Form extends Common {
  #deleteAccountForm;
  #deleteAccountSubmitButton;
  #formType;
  #formPasswordWarning;
  #loginForm;
  #lFLoginInput;
  #lFPasswordInput;
  #lFSubmitButton;
  #registerForm;
  #rFLoginInput;
  #rFNameInput;
  #rFPasswordInput;
  #rFPasswordRepeatedInput;
  #rFSubmitButton;

  constructor() {
    super();
    this.#bindToFormElements();
  }

  #bindToFormElements() {
    this.#deleteAccountForm = this.bindToElement(DELETE_ACCOUNT_FORM_ID);
    this.#loginForm = this.bindToElement(LOGIN_FORM_ID);
    this.#deleteAccountSubmitButton = this.bindToElement(DELETE_ACCOUNT_SUBMIT_BUTTON_ID);
    this.#formPasswordWarning = this.bindToElement(FORM_PASSWORD_WARNING_ID);
    this.#lFLoginInput = this.bindToElement(LF_LOGIN_INPUT_ID);
    this.#lFPasswordInput = this.bindToElement(LF_PASSWORD_INPUT_ID);
    this.#lFSubmitButton = this.bindToElement(LF_SUBMIT_BUTTON_ID);
    this.#registerForm = this.bindToElement(REGISTER_FORM_ID);
    this.#rFLoginInput = this.bindToElement(RF_LOGIN_INPUT_ID);
    this.#rFNameInput = this.bindToElement(RF_NAME_INPUT_ID);
    this.#rFPasswordInput = this.bindToElement(RF_PASSWORD_INPUT_ID);
    this.#rFPasswordRepeatedInput = this.bindToElement(RF_PASSWORD_REPEATED_INPUT_ID);
    this.#rFSubmitButton = this.bindToElement(RF_SUBMIT_BUTTON_ID);

    this.#lFLoginInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#lFPasswordInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#rFLoginInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#rFNameInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#rFPasswordInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#rFPasswordRepeatedInput.addEventListener('input', (e) => this.#handleUserInput(e));
    this.#lFSubmitButton.addEventListener('click', (e) => this.#submitLoginForm(e));
    this.#rFSubmitButton.addEventListener('click', (e) => this.#submitRegisterForm(e));
    this.#deleteAccountSubmitButton.addEventListener('click', (e) => {
      this.#submitDeleteAccountForm(e);
    });
  }

  openLoginForm() {
    this.#clearFormInputValues();
    this.#clearFormInformationsForUser();
    this.#formType = LOGIN_FORM_ID;
    this.changeVisibility(this.#registerForm, HIDE);
    this.changeVisibility(this.#loginForm, SHOW);
  }

  openRegisterForm() {
    this.#clearFormInputValues();
    this.#clearFormInformationsForUser();
    this.#formType = REGISTER_FORM_ID;
    this.changeVisibility(this.#loginForm, HIDE);
    this.changeVisibility(this.#formPasswordWarning, SHOW);
    this.changeVisibility(this.#registerForm, SHOW);
  }

  openDeleteAccountForm() {
    this.#clearFormInformationsForUser();
    this.#formType = DELETE_ACCOUNT_FORM_ID;
    this.changeVisibility(this.#deleteAccountForm, SHOW);
  }

  closeForm() {
    this.#clearFormInputValues();
    this.#clearFormInformationsForUser();
    this.#formType = null;
    this.changeVisibility(this.#loginForm, HIDE);
    this.changeVisibility(this.#registerForm, HIDE);
    this.changeVisibility(this.#deleteAccountForm, HIDE);
  }

  #handleUserInput(e) {
    if (e.target.id === RF_PASSWORD_INPUT_ID) {
      this.changeVisibility(this.#formPasswordWarning, HIDE);
    }

    if (e.target.id === RF_PASSWORD_INPUT_ID && !e.target.value) {
      this.changeVisibility(this.#formPasswordWarning, SHOW);
    }

    this.#clearFormWarnings();
    const { warnings } = handleValidateInput({ [e.target.id]: e.target.value });
    this.#setFormWarnings(warnings);
  }

  #submitLoginForm(e) {
    const dataToValidate = {
      [LF_LOGIN_INPUT_ID]: this.#lFLoginInput.value,
      [LF_PASSWORD_INPUT_ID]: this.#lFPasswordInput.value,
    };
    const dataToSend = {
      login: this.#lFLoginInput.value,
      password: this.#lFPasswordInput.value,
    };
    e.preventDefault();
    this.#submitForm('/login', dataToValidate, dataToSend);
  }

  #submitRegisterForm(e) {
    const dataToValidate = {
      [RF_NAME_INPUT_ID]: this.#rFNameInput.value,
      [RF_LOGIN_INPUT_ID]: this.#rFLoginInput.value,
      [RF_PASSWORD_INPUT_ID]: this.#rFPasswordInput.value,
      [RF_PASSWORD_REPEATED_INPUT_ID]: this.#rFPasswordRepeatedInput.value,
    };
    const dataToSend = {
      login: this.#rFLoginInput.value,
      name: this.#rFNameInput.value,
      password: this.#rFPasswordInput.value,
      passwordRepeated: this.#rFPasswordRepeatedInput.value,
    };
    e.preventDefault();
    this.#submitForm('/register', dataToValidate, dataToSend);
  }

  #submitDeleteAccountForm(e) {
    e.preventDefault();
    this.#submitForm('/delete');
  }

  #submitForm(endpoint, dataToValidate, dataToSend) {
    this.#clearFormInformationsForUser();

    if (dataToValidate) {
      const { errors } = handleValidateInput(dataToValidate);
      this.#setFormErrors(errors);

      if (errors.length === 0) {
        if (this.#formType === LOGIN_FORM_ID) {
          this.#handleHTTPRequestStatus(this.#lFSubmitButton, START_HTTP_REQUEST);
        } else if (this.#formType === REGISTER_FORM_ID) {
          this.#handleHTTPRequestStatus(this.#rFSubmitButton, START_HTTP_REQUEST);
        }

        axios
          .post(endpoint, dataToSend)
          .then((res) => {
            if (res.status === 200 && this.#formType === LOGIN_FORM_ID) {
              this.#handleHTTPRequestStatus(this.#lFSubmitButton, FINISH_HTTP_REQUEST);
              User.userData = res.data;
              modal.closeModal();
              form.closeForm();
              menu.handleUserLoggedIn();
            } else if (res.status === 200 && this.#formType === REGISTER_FORM_ID) {
              this.#handleHTTPRequestStatus(this.#rFSubmitButton, FINISH_HTTP_REQUEST);
              this.#handleUserActionSuccess('Konto zostało utworzone! Możesz się zalogować.', [
                FORM_INFO_CLASS,
              ]);
            }
          })
          .catch((err) => {
            if (this.#formType === LOGIN_FORM_ID) {
              this.#handleHTTPRequestStatus(this.#lFSubmitButton, FINISH_HTTP_REQUEST);
            } else if (this.#formType === REGISTER_FORM_ID) {
              this.#handleHTTPRequestStatus(this.#rFSubmitButton, FINISH_HTTP_REQUEST);
            }

            if (err.response) {
              this.#handleServerErrors(err.response.data);
            }
          });
      }
    } else {
      if (this.#formType === DELETE_ACCOUNT_FORM_ID) {
        this.#handleHTTPRequestStatus(this.#deleteAccountSubmitButton, START_HTTP_REQUEST);
      }

      axios
        .delete(endpoint, {
          headers: {
            ...axios.headers,
            authorization: localStorage.getItem('jwt')
              ? `Bearer ${localStorage.getItem('jwt')}`
              : '',
          },
        })
        .then((res) => {
          if (res.status === 200 && this.#formType === DELETE_ACCOUNT_FORM_ID) {
            this.#handleHTTPRequestStatus(this.#deleteAccountSubmitButton, FINISH_HTTP_REQUEST);
            this.#handleUserActionSuccess('Konto zostało usunięte', [
              FORM_INFO_CLASS,
              FORM_INFO_DELETE_ACCOUNT_CLASS,
            ]);
            menu.handleUserLoggedOut();
          }
        })
        .catch((err) => {
          if (err.response) {
            this.#handleServerErrors(err.response.data);
          }
        });
    }
  }

  #handleHTTPRequestStatus(elementToAppendLoadingSpinner, mode) {
    if (mode === START_HTTP_REQUEST) {
      const loadingSpinner = document.createElement('span');
      loadingSpinner.classList.add(LOADING_SPINNER_CLASS);
      elementToAppendLoadingSpinner.appendChild(loadingSpinner);
      if (elementToAppendLoadingSpinner.nodeName === 'BUTTON') {
        elementToAppendLoadingSpinner.disabled = true;
      }
    } else if (mode === FINISH_HTTP_REQUEST) {
      document.querySelector(`.${LOADING_SPINNER_CLASS}`).remove();
      if (elementToAppendLoadingSpinner.nodeName === 'BUTTON') {
        elementToAppendLoadingSpinner.disabled = false;
      }
    }
  }

  #setFormWarnings(warnings) {
    warnings.forEach((warning) => {
      const inputName = Object.keys(warning).toString();
      const inputWarning = Object.values(warning).toString();
      if (inputName && inputWarning) {
        const warning = document.createElement('span');
        warning.classList.add(FORM_WARNING_CLASS);
        warning.innerText = inputWarning;
        const input = document.getElementById(inputName);
        input.parentNode.insertBefore(warning, input);
      }
    });
  }

  #setFormErrors(errors) {
    errors.forEach((error) => {
      const inputName = Object.keys(error).toString();
      const inputError = Object.values(error).toString();

      if (inputName && inputError) {
        const error = document.createElement('span');
        error.classList.add(FORM_ERROR_CLASS);
        error.innerText = inputError;

        if (inputName === SERVER_ERROR_UNCATEGORIZED_ERRORS) {
          if (this.#formType === LOGIN_FORM_ID) {
            this.#loginForm.prepend(error);
          } else if (this.#formType === REGISTER_FORM_ID) {
            this.#registerForm.prepend(error);
          } else if (this.#formType === DELETE_ACCOUNT_FORM_ID) {
            this.#deleteAccountForm.prepend(error);
          }
        } else {
          const input = document.getElementById(inputName);
          input.parentNode.insertBefore(error, input);
        }
      }
    });
  }

  #handleServerErrors(errors) {
    const modifiedErrors = [];

    errors.forEach((error) => {
      const inputName = Object.keys(error).toString();
      const inputError = Object.values(error).toString();
      if (inputName === SERVER_ERROR_LOGIN) {
        if (this.#formType === LOGIN_FORM_ID) {
          modifiedErrors.push({ [LF_LOGIN_INPUT_ID]: inputError });
        } else if (this.#formType === REGISTER_FORM_ID) {
          modifiedErrors.push({ [RF_LOGIN_INPUT_ID]: inputError });
        } else if (this.#formType === DELETE_ACCOUNT_FORM_ID) {
          modifiedErrors.push({ [SERVER_ERROR_UNCATEGORIZED_ERRORS]: inputError });
        }
      }

      if (inputName === SERVER_ERROR_PASSWORD) {
        if (this.#formType === LOGIN_FORM_ID) {
          modifiedErrors.push({ [LF_PASSWORD_INPUT_ID]: inputError });
        } else if (this.#formType === REGISTER_FORM_ID) {
          modifiedErrors.push({ [RF_PASSWORD_INPUT_ID]: inputError });
        }
      }

      if (inputName === SERVER_ERROR_NAME) {
        modifiedErrors.push({ [RF_NAME_INPUT_ID]: inputError });
      }

      if (inputName === SERVER_ERROR_PASSWORD_REPEATED) {
        modifiedErrors.push({ [RF_PASSWORD_REPEATED_INPUT_ID]: inputError });
      }

      if (
        inputName !== SERVER_ERROR_LOGIN &&
        inputName !== SERVER_ERROR_PASSWORD &&
        inputName !== SERVER_ERROR_NAME &&
        inputName !== SERVER_ERROR_PASSWORD_REPEATED
      ) {
        modifiedErrors.push({ [SERVER_ERROR_UNCATEGORIZED_ERRORS]: inputError });
      }

      this.#setFormErrors(modifiedErrors);
    });
  }

  #handleUserActionSuccess(text, classNames) {
    const info = document.createElement('span');
    classNames.forEach((classname) => info.classList.add(classname));
    info.innerText = text;
    form.closeForm();
    modal.closeModal();
    menu.loginButton.parentNode.insertBefore(info, menu.loginButton);
  }

  #clearFormInputValues() {
    this.#lFLoginInput.value = null;
    this.#lFPasswordInput.value = null;
    this.#rFLoginInput.value = null;
    this.#rFNameInput.value = null;
    this.#rFPasswordInput.value = null;
    this.#rFPasswordRepeatedInput.value = null;
  }

  #clearFormWarnings() {
    const currentWarnings = document.querySelectorAll(`.${FORM_WARNING_CLASS}`);
    const dataToValidate = {};
    currentWarnings.forEach(
      (currentWarning) =>
        (dataToValidate[currentWarning.nextElementSibling.id] =
          currentWarning.nextElementSibling.value)
    );
    const { warnings } = handleValidateInput(dataToValidate);
    currentWarnings.forEach(
      (currentWarning) =>
        !warnings.some(
          (warning) => Object.keys(warning).toString() === currentWarning.nextSibling.id
        ) && currentWarning.remove()
    );
  }

  #clearFormErrors() {
    const errors = document.querySelectorAll(`.${FORM_ERROR_CLASS}`);
    if (errors) {
      errors.forEach((error) => error.remove());
    }
  }

  #clearFormInformations() {
    const informations = document.querySelectorAll(`.${FORM_INFO_CLASS}`);
    if (informations) {
      informations.forEach((info) => info.remove());
    }
  }

  #clearFormInformationsForUser() {
    this.#clearFormWarnings();
    this.#clearFormErrors();
    this.#clearFormInformations();
  }

  get formType() {
    return this.#formType;
  }
}

export const form = new Form();

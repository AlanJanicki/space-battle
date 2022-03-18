import { canvas } from './Canvas';
import { Common, HIDE, SHOW } from './Common';
import { DELETE_ACCOUNT_FORM_ID, form } from './Form';
import { menu } from './Menu';
import { settings } from './Settings';

export const ESCAPE_KEY = 'Escape';
const CLOSE_BUTTON_ID = 'js-close-button';
const MODAL_ID = 'js-modal';

class Modal extends Common {
  constructor() {
    super(MODAL_ID);
    this.#bindToModalElements();
  }

  #bindToModalElements() {
    const closeButton = this.bindToElement(CLOSE_BUTTON_ID);

    closeButton.addEventListener('click', () => this.closeModal());
    window.addEventListener('keydown', (e) => this.#closeModalWithKeyboard(e));
  }

  openModal() {
    this.changeVisibility(this.element, SHOW);
  }

  closeModal() {
    this.changeVisibility(this.element, HIDE);

    if (form.formType === DELETE_ACCOUNT_FORM_ID) {
      form.closeForm();
      this.changeVisibility(menu.element, SHOW);
    }

    if (this.isVisible(settings.element) && !this.isVisible(canvas.element)) {
      settings.closeSettings();
      this.changeVisibility(menu.element, SHOW);
    } else if (this.isVisible(settings.element) && this.isVisible(canvas.element)) {
      settings.closeSettings();
      menu.handleOpenGameMenu();
    } else if (!this.isVisible(settings.element) && this.isVisible(menu.gameMenu)) {
      menu.handleCloseGameMenu();
    }

    window.removeEventListener('keydown', (e) => this.#closeModalWithKeyboard(e));
  }

  #closeModalWithKeyboard(e) {
    if (
      e.key === ESCAPE_KEY &&
      this.isVisible(this.element) &&
      !this.isVisible(canvas.element) &&
      !this.isVisible(menu.gameMenu)
    ) {
      this.closeModal();
    }
  }
}

export const modal = new Modal();

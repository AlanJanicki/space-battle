export const HIDE = false;
export const HIDDEN_CLASS = 'hidden';
export const SHOW = true;

export class Common {
  constructor(elementToBind) {
    if (typeof elementToBind === 'undefined') {
      return;
    }
    this.element = this.bindToElement(elementToBind);
  }

  bindToElement(elementToBind) {
    const element = document.getElementById(elementToBind);

    if (!element) {
      throw new Error(`Brak elementu o id:${elementToBind}`);
    }

    return element;
  }

  changeVisibility(element, mode) {
    if (mode === SHOW) {
      element.classList.remove(HIDDEN_CLASS);
    } else if (mode === HIDE) {
      element.classList.add(HIDDEN_CLASS);
    }
  }

  isVisible(element) {
    if (!element.classList.contains(HIDDEN_CLASS)) return true;
    return false;
  }
}

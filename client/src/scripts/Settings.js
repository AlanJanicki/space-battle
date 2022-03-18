import { Common, HIDE, SHOW } from './Common';
import { media } from './Media';

const DECREASE_BACKGROUND_MUSIC_VOLUME_BUTTON_ID = 'js-decrease-background-music-volume-button';
const DECREASE_SOUND_VOLUME_BUTTON_ID = 'js-decrease-sound-volume-button';
const INCREASE_BACKGROUND_MUSIC_VOLUME_BUTTON_ID = 'js-increase-background-music-volume-button';
const INCREASE_SOUND_VOLUME_BUTTON_ID = 'js-increase-sound-volume-button';
const MUSIC_ON_BUTTON_CLASS = 'settings__button--music-on';
const SOUND_DISABLED_BUTTON_CLASS = 'settings__button--disabled';
const SOUND_ON_BUTTON_CLASS = 'settings__button--sound-on';
const SOUND_ON_ICON_CLASS = 'fa-volume-high';
const SOUND_OFF_ICON_CLASS = 'fa-volume-xmark';
const SETTINGS_ID = 'js-settings';
const TOGGLE_BACKGROUND_MUSIC_BUTTON_ID = 'js-toggle-background-music-button';
const TOGGLE_SOUND_BUTTON_ID = 'js-toggle-sound-button';
const TOGGLE_SOUND_ICON_ID = 'js-toggle-sound-icon';

class Settings extends Common {
  #decreaseBackgroundMusicVolumeButton;
  #increaseBackgroundMusicVolumeButton;
  #decreaseSoundVolumeButton;
  #increaseSoundVolumeButton;
  #toggleBackgroundMusicButton;
  #toggleSoundButton;

  constructor() {
    super(SETTINGS_ID);
    this.#bindToSettingsElements();
  }

  #bindToSettingsElements() {
    this.#toggleBackgroundMusicButton = this.bindToElement(TOGGLE_BACKGROUND_MUSIC_BUTTON_ID);
    this.#increaseBackgroundMusicVolumeButton = this.bindToElement(
      INCREASE_BACKGROUND_MUSIC_VOLUME_BUTTON_ID
    );
    this.#decreaseBackgroundMusicVolumeButton = this.bindToElement(
      DECREASE_BACKGROUND_MUSIC_VOLUME_BUTTON_ID
    );
    this.#toggleSoundButton = this.bindToElement(TOGGLE_SOUND_BUTTON_ID);
    this.#increaseSoundVolumeButton = this.bindToElement(INCREASE_SOUND_VOLUME_BUTTON_ID);
    this.#decreaseSoundVolumeButton = this.bindToElement(DECREASE_SOUND_VOLUME_BUTTON_ID);

    this.#toggleBackgroundMusicButton.addEventListener('click', () =>
      this.#toggleBackgroundMusic()
    );
    this.#toggleSoundButton.addEventListener('click', () => this.#toggleSound());
    this.#decreaseBackgroundMusicVolumeButton.addEventListener('click', () =>
      this.#decreaseMusicVolume()
    );
    this.#decreaseSoundVolumeButton.addEventListener('click', () => this.#decreaseSoundVolume());
    this.#increaseBackgroundMusicVolumeButton.addEventListener('click', () =>
      this.#increaseMusicVolume()
    );
    this.#increaseSoundVolumeButton.addEventListener('click', () => this.#increaseSoundVolume());
  }

  openSettings() {
    this.changeVisibility(this.element, SHOW);
  }

  closeSettings() {
    this.changeVisibility(this.element, HIDE);
  }

  #toggleBackgroundMusic() {
    if (this.#toggleBackgroundMusicButton.classList.contains(MUSIC_ON_BUTTON_CLASS)) {
      this.#toggleBackgroundMusicButton.classList.remove(MUSIC_ON_BUTTON_CLASS);
    } else {
      this.#toggleBackgroundMusicButton.classList.add(MUSIC_ON_BUTTON_CLASS);
    }
    media.toggleBackgroundMusic();
  }

  #toggleSound() {
    const toggleSoundIconEl = document.getElementById(TOGGLE_SOUND_ICON_ID);
    if (this.#toggleSoundButton.classList.contains(SOUND_ON_BUTTON_CLASS)) {
      this.#toggleSoundButton.classList.remove(SOUND_ON_BUTTON_CLASS);
      toggleSoundIconEl.classList.remove(SOUND_ON_ICON_CLASS);
      toggleSoundIconEl.classList.add(SOUND_OFF_ICON_CLASS);
    } else {
      this.#toggleSoundButton.classList.add(SOUND_ON_BUTTON_CLASS);
      toggleSoundIconEl.classList.remove(SOUND_OFF_ICON_CLASS);
      toggleSoundIconEl.classList.add(SOUND_ON_ICON_CLASS);
    }
    media.toggleSound();
  }

  #decreaseMusicVolume() {
    this.#increaseBackgroundMusicVolumeButton.disabled = false;
    this.#increaseBackgroundMusicVolumeButton.classList.remove(SOUND_DISABLED_BUTTON_CLASS);

    media.decreaseMusicVolume();
    if (media.musicVolume === 0) {
      this.#decreaseBackgroundMusicVolumeButton.disabled = true;
      this.#decreaseBackgroundMusicVolumeButton.classList.add(SOUND_DISABLED_BUTTON_CLASS);
    }
  }

  #decreaseSoundVolume() {
    this.#increaseSoundVolumeButton.disabled = false;
    this.#increaseSoundVolumeButton.classList.remove(SOUND_DISABLED_BUTTON_CLASS);

    media.decreaseSoundVolume();
    if (media.soundVolume === 0) {
      this.#decreaseSoundVolumeButton.disabled = true;
      this.#decreaseSoundVolumeButton.classList.add(SOUND_DISABLED_BUTTON_CLASS);
    }
  }

  #increaseMusicVolume() {
    this.#decreaseBackgroundMusicVolumeButton.disabled = false;
    this.#decreaseBackgroundMusicVolumeButton.classList.remove(SOUND_DISABLED_BUTTON_CLASS);

    media.increaseMusicVolume();
    if (media.musicVolume === 1) {
      this.#increaseBackgroundMusicVolumeButton.disabled = true;
      this.#increaseBackgroundMusicVolumeButton.classList.add(SOUND_DISABLED_BUTTON_CLASS);
    }
  }

  #increaseSoundVolume() {
    this.#decreaseSoundVolumeButton.disabled = false;
    this.#decreaseSoundVolumeButton.classList.remove(SOUND_DISABLED_BUTTON_CLASS);

    media.increaseSoundVolume();
    if (media.soundVolume === 1) {
      this.#increaseSoundVolumeButton.disabled = true;
      this.#increaseSoundVolumeButton.classList.add(SOUND_DISABLED_BUTTON_CLASS);
    }
  }
}

export const settings = new Settings();

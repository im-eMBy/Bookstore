import { LightningElement, api } from "lwc";

export default class ShopHamburgerButton extends LightningElement {
  open;
  isLoaded;

  @api
  get isOpen() {
    return this.open;
  }
  set isOpen(value) {
    this.open = value;
    if (value && this.isLoaded) {
      this.template.querySelector(".button").classList.add("button--open");
    }
    if (!value && this.isLoaded) {
      this.template.querySelector(".button").classList.remove("button--open");
    }
  }

  @api openCallback;
  @api closeCallback;

  connectedCallback() {
    this.isLoaded = true;
  }

  handleButtonClick() {
    if (this.isOpen) {
      this.closeCallback();
    }
    if (!this.isOpen) {
      this.openCallback();
    }
  }
}

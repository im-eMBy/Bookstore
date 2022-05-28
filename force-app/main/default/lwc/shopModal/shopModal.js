import { LightningElement, api } from "lwc";

export default class ShopModal extends LightningElement {
  @api
  get isShown() {
    return this.visible;
  }
  set isShown(value) {
    this.visible = value;
    if (value && this.isLoaded) {
      this.showModal();
    }
    if (!value && this.isLoaded) {
      this.hideModal();
    }
  }
  @api header;
  @api message;
  @api primeAction;
  @api secAction;
  @api primeActionLabel = "Hide";
  @api secActionLabel = "Hide";
  get messages() {
    return this.message.split("\n");
  }

  visible;
  isLoaded;

  handlePrimeAction() {
    if (this.primeAction) this.primeAction();
  }
  handleSecAction() {
    if (this.secAction) this.secAction();
  }
  showModal() {
    this.template.querySelector(".modal").classList.remove("slds-fade-in-hide");
    this.template.querySelector(".modal").classList.add("slds-fade-in-open");
  }
  hideModal() {
    this.template.querySelector(".modal").classList.remove("slds-fade-in-open");
    this.template.querySelector(".modal").classList.add("slds-fade-in-hide");
  }
  connectedCallback() {
    this.isLoaded = true;
  }
}

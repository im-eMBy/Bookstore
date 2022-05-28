import { LightningElement, api } from "lwc";

export default class ShopAddressForm extends LightningElement {
  @api contactAddress;
  @api updateParent;
  address;

  connectedCallback() {
    this.address = { ...this.contactAddress };
    if (this.address.street === undefined) this.address.street = "";
    if (this.address.city === undefined) this.address.city = "";
    if (this.address.postalCode === undefined) this.address.postalCode = "";
    if (this.address.state === undefined) this.address.state = "";
    if (this.address.country === undefined) this.address.country = "";
  }
  handleUpdatePanel() {
    if (this.updateParent) this.updateParent(this.address);
  }
  handleStreetChange(ev) {
    this.address.street = ev.target.value;
    this.handleUpdatePanel();
  }
  handleCityChange(ev) {
    this.address.city = ev.target.value;
    this.handleUpdatePanel();
  }
  handlePostalCodeChange(ev) {
    this.address.postalCode = ev.target.value;
    this.handleUpdatePanel();
  }
  handleStateChange(ev) {
    this.address.state = ev.target.value;
    this.handleUpdatePanel();
  }
  handleCountryChange(ev) {
    this.address.country = ev.target.value;
    this.handleUpdatePanel();
  }
}

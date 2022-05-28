import { LightningElement, api } from "lwc";

export default class ShopBookStar extends LightningElement {
  @api type;
  get full() {
    return this.type === "full";
  }
  get half() {
    return this.type === "half";
  }
  get blank() {
    return this.type === "blank";
  }
}

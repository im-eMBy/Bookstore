import { LightningElement } from "lwc";

export default class ShopBackButton extends LightningElement {
  handleClick() {
    window.history.back();
  }
}

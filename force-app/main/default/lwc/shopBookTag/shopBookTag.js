import { LightningElement, api } from "lwc";

export default class ShopBookTag extends LightningElement {
  @api tag;
  tagIconSrc;

  connectedCallback() {
    this.tagIconSrc = `/file-asset/${this.tag.replace(/\s/g, "_")}_Tag_Icon`;
  }
}

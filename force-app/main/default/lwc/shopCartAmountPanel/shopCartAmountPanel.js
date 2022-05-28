import { LightningElement, api } from "lwc";
import editAmount from "@salesforce/apex/ShopCartController.editAmount";

export default class ShopCartAmountPanel extends LightningElement {
  @api position;
  @api updateCallback;

  isEdited;
  newAmount;

  connectedCallback() {
    this.newAmount = this.position.Amount__c;
  }
  handleEdit() {
    this.isEdited = true;
  }
  handleAmountChange(ev) {
    if (Number(ev.target.value) > this.position.Book__r.Stock__c) {
      this.newAmount = this.position.Book__r.Stock__c;
      ev.target.value = this.position.Book__r.Stock__c;
      return;
    }
    if (Number(ev.target.value) < 1) {
      this.newAmount = 1;
      ev.target.value = 1;
      return;
    }
    this.newAmount = Number(ev.target.value);
  }
  handleSave() {
    if (this.newAmount === this.position.Amount__c) {
      this.isEdited = false;
      return;
    }
    editAmount({ positionId: this.position.Id, amount: this.newAmount })
      .then(() => {
        this.updateCallback();
        this.isEdited = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

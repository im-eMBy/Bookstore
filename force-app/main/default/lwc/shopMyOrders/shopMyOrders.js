import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getOrders from "@salesforce/apex/OrderController.getOrders";

export default class ShopMyOrders extends NavigationMixin(LightningElement) {
  orders;
  isLoaded;
  get isNoOrders() {
    if (this.isLoaded && this.orders.length === 0) {
      return true;
    }
    return false;
  }
  connectedCallback() {
    getOrders()
      .then((orders) => {
        this.orders = orders;
        this.isLoaded = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleOrderClick(ev) {
    const recordId = ev.currentTarget.dataset.value;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        objectApiName: "Online_order__c",
        actionName: "view"
      }
    });
  }
}

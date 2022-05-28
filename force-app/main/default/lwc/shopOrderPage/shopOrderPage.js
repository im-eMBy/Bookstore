import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
import getOrder from "@salesforce/apex/OrderController.getOrder";
import getOrderPositions from "@salesforce/apex/OrderController.getOrderPositions";
import cancelOrder from "@salesforce/apex/OrderController.cancelOrder";

export default class ShopOrderPage extends NavigationMixin(LightningElement) {
  @api recordId = "a01IY000000V6HEYA0";
  order;
  orderPositions;
  isLoaded;

  isModal = false;
  modalMessage;

  get isNoPositions() {
    if (this.isLoaded && this.orderPositions.length === 0) {
      return true;
    }
    return false;
  }
  get canCancel() {
    if (
      this.order.Status__c === "New" ||
      this.order.Status__c === "In progress"
    )
      return true;
    return false;
  }

  connectedCallback() {
    getOrder({ orderId: this.recordId })
      .then((order) => {
        this.order = order;
      })
      .catch((error) => {
        console.log(error);
      });
    getOrderPositions({ orderId: this.recordId })
      .then((positions) => {
        this.orderPositions = positions;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleCancel() {
    cancelOrder({ orderId: this.recordId })
      .then(() => {
        this.modalMessage = "Your order has been successfully canceled.";
        this.isModal = true;
      })
      .catch((error) => {
        this.modalMessage = error.body.message;
        this.isModal = true;
        console.log(error);
      });
  }
  handleCloseModal = () => {
    this.isModal = false;
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/my-orders"
      }
    });
  };
  handleNavigateToBook(ev) {
    ev.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: ev.target.dataset.id,
        objectApiName: "Book__c",
        actionName: "view"
      }
    });
  }
}

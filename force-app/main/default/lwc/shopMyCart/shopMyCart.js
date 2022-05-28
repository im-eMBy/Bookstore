import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getCartPositions from "@salesforce/apex/ShopCartController.getCartPositions";
import removeFromCart from "@salesforce/apex/ShopCartController.removeFromCart";

export default class ShopMyCart extends NavigationMixin(LightningElement) {
  cartPositions;
  isLoaded = false;
  get isAnyPosition() {
    return this.cartPositions && this.cartPositions.length > 0;
  }
  get isNoPosition() {
    return !this.isAnyPosition && this.isLoaded;
  }
  get totalValue() {
    if (!this.cartPositions || this.cartPositions.length < 1) return 0;
    return this.cartPositions
      .reduce((prev, curr) => {
        return prev + curr.Value__c;
      }, 0)
      .toFixed(2);
  }

  connectedCallback() {
    getCartPositions()
      .then((data) => {
        this.cartPositions = data;
        this.isLoaded = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleRemove(ev) {
    const id = ev.target.value;
    removeFromCart({ positionId: id })
      .then(() => {
        this.cartPositions = this.cartPositions.filter((pos) => pos.Id !== id);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChangeAmount = () => {
    getCartPositions()
      .then((data) => {
        this.cartPositions = data;
      })
      .catch((error) => {
        console.log(error);
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

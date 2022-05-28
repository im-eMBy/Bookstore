import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
import addToCart from "@salesforce/apex/ShopCartController.addToCart";
import checkIfInCart from "@salesforce/apex/ShopCartController.checkIfInCart";
import isGuestUser from "@salesforce/user/isGuest";

export default class ShopAddToCartPanel extends NavigationMixin(
  LightningElement
) {
  @api book;
  orderAmount = 1;
  inCartAmount = 0;
  message;
  isModal = false;
  get isInCart() {
    return this.inCartAmount > 0;
  }
  get value() {
    return (this.orderAmount * this.book.Price__c).toFixed(2);
  }

  connectedCallback() {
    if (isGuestUser) return;
    checkIfInCart({ bookId: this.book.Id })
      .then((amount) => {
        this.inCartAmount = amount;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleOrderAmountChange(ev) {
    if (Number(ev.target.value) > this.book.Stock__c - this.inCartAmount) {
      this.orderAmount = this.book.Stock__c - this.inCartAmount;
      ev.target.value = this.book.Stock__c - this.inCartAmount;
      return;
    }
    if (Number(ev.target.value) < 1) {
      this.orderAmount = 1;
      ev.target.value = 1;
      return;
    }
    this.orderAmount = Number(ev.target.value);
  }
  handleSubtractAmount() {
    if (this.orderAmount <= 1) return;
    this.orderAmount--;
  }
  handleAddAmount() {
    if (this.orderAmount >= this.book.Stock__c - this.inCartAmount) return;
    this.orderAmount++;
  }
  handleAddToCart() {
    if (isGuestUser) {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: basePath + "/login"
        }
      });
    }
    if (this.orderAmount + this.inCartAmount > this.book.Stock__c) {
      this.message = "Sorry, can't add more than stock.";
      this.isModal = true;
      return;
    }
    addToCart({ amount: this.orderAmount, book: this.book })
      .then(() => {
        this.inCartAmount += this.orderAmount;
        this.message = "Added to cart";
        this.isModal = true;
      })
      .catch((error) => {
        this.message = "An error occurred try again later.";
        this.isModal = true;
        console.log(error);
      });
  }
  modalPrimeAction = () => {
    this.isModal = false;
    this.navigateToCart();
  };
  modalSecAction = () => {
    this.isModal = false;
  };
  navigateToCart() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/my-cart"
      }
    });
  }
}

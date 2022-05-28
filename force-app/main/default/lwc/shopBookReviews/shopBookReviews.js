import { LightningElement, api } from "lwc";
import getBookReviews from "@salesforce/apex/BooksController.getBookReviews";
import getCurrentUserContactId from "@salesforce/apex/ShopUserController.getCurrentUserContactId";
import isGuestUser from "@salesforce/user/isGuest";

export default class ShopBookReviews extends LightningElement {
  @api bookId;
  reviews;
  avgRating;

  isGuest = isGuestUser;
  userId;
  get rating() {
    return this.avgRating.toFixed(2);
  }
  get canAdd() {
    if (!this.reviews || !this.userId) return false;
    const alreadyAdded =
      this.reviews.filter((el) => el.Author__c === this.userId).length > 0;
    return !this.isGuest && !alreadyAdded;
  }

  connectedCallback() {
    getCurrentUserContactId()
      .then((value) => {
        this.userId = value;
      })
      .catch((error) => {
        console.log(error);
      });
    this.getReviews();
  }
  getReviews() {
    getBookReviews({ bookId: this.bookId })
      .then((data) => {
        this.reviews = data;

        this.avgRating =
          this.reviews.reduce((acc, rev) => {
            return acc + rev.Rating__c;
          }, 0) / this.reviews.length;
        if (this.reviews.length === 0) this.avgRating = 0;
      })
      .catch((error) => {
        console.log(error.body.message);
      });
  }
  handleNewReview = () => {
    this.getReviews();
  };
  handleDelete = () => {
    this.getReviews();
  };
}

import { LightningElement, api } from "lwc";
import deleteBookReview from "@salesforce/apex/BooksController.deleteBookReview";

export default class ShopBookReview extends LightningElement {
  @api review;
  @api userId;
  @api deleteCallback;
  get canDelete() {
    return this.userId === this.review.Author__c;
  }

  handleDelete() {
    deleteBookReview({ reviewId: this.review.Id })
      .then(() => {
        this.deleteCallback();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

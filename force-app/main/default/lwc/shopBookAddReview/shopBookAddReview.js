import { LightningElement, api } from "lwc";
import createBookReview from "@salesforce/apex/BooksController.createBookReview";

export default class ShopBookAddReview extends LightningElement {
  @api bookId;
  @api addReviewCallback;
  rating = 3;
  text = "";
  unfolded = false;

  handleRatingUp() {
    if (this.rating === 5) return;
    this.rating++;
  }
  handleRatingDown() {
    if (this.rating === 1) return;
    this.rating--;
  }
  handleTextChange(ev) {
    this.text = ev.target.value;
  }
  handleUnfold() {
    const content = this.template.querySelector(".review-form");
    content.classList.add("review-form--open");
    content.style.maxHeight = content.scrollHeight + "px";
    this.unfolded = true;
  }
  handleFold() {
    const content = this.template.querySelector(".review-form");
    content.classList.remove("review-form--open");
    content.style.maxHeight = null;
    this.unfolded = false;
  }
  handleAddReview(ev) {
    ev.preventDefault();
    createBookReview({
      bookId: this.bookId,
      text: this.text,
      rating: this.rating
    })
      .then(() => {
        this.addReviewCallback();
        this.text = "";
        this.rating = 3;
        this.handleFold();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

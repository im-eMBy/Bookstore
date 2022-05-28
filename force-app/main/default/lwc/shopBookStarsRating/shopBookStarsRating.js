import { LightningElement, api } from "lwc";

export default class ShopBookStarsRating extends LightningElement {
  @api rating;
  get stars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (this.rating - i > -0.25) stars.push("full");
      else if (this.rating - i > -0.75) stars.push("half");
      else stars.push("blank");
    }
    return stars.map((el, i) => {
      return { type: el, index: i };
    });
  }
}

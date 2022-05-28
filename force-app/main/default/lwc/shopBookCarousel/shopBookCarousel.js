import { LightningElement } from "lwc";
import getAllAvailableBooks from "@salesforce/apex/BooksController.getAllAvailableBooks";

export default class ShopBookCarousel extends LightningElement {
  books;

  connectedCallback() {
    getAllAvailableBooks()
      .then((books) => {
        this.books = books;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

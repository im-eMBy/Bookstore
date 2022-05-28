import { LightningElement, api } from "lwc";
import getBook from "@salesforce/apex/BooksController.getBook";

export default class ShopBookPage extends LightningElement {
  @api recordId;

  book;
  tags;

  connectedCallback() {
    getBook({
      Id: this.recordId
    })
      .then((data) => {
        this.book = data;
        if (data.Tags__c) {
          this.tags = data.Tags__c.split(";");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

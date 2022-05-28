import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class ShopBookThumbnail extends NavigationMixin(
  LightningElement
) {
  @api book;

  handleClick() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.book.Id,
        objectApiName: "Book__c",
        actionName: "view"
      }
    });
  }
}

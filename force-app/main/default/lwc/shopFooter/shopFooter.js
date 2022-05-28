import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import isGuestUser from "@salesforce/user/isGuest";
import basePath from "@salesforce/community/basePath";

export default class ShopFooter extends NavigationMixin(LightningElement) {
  isGuest = isGuestUser;

  handleNavigate(ev) {
    ev.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + ev.currentTarget.dataset.target
      }
    });
  }
}

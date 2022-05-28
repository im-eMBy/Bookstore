import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
import login from "@salesforce/apex/ShopUserController.login";

export default class ShopCustomLogin extends NavigationMixin(LightningElement) {
  email = "";
  password = "";
  error;

  handleEmailChange(ev) {
    this.email = ev.target.value;
  }
  handlePasswordChange(ev) {
    this.password = ev.target.value;
  }
  handleLogin(ev) {
    ev.preventDefault();
    login({ email: this.email, password: this.password })
      .then((url) => {
        window.open(url, "_self");
      })
      .catch((error) => {
        this.error = error.body.message;
        console.log(error);
      });
  }
  handleNavigateRegister(ev) {
    ev.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/SelfRegister"
      }
    });
  }
}

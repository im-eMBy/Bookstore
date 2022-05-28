import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
import register from "@salesforce/apex/ShopUserController.register";

export default class ShopCustomRegistration extends NavigationMixin(
  LightningElement
) {
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  confirmPassword = "";

  error;
  isModal;
  modalMessage;

  handleFirstNameChange(ev) {
    this.firstName = ev.target.value;
  }
  handleLastNameChange(ev) {
    this.lastName = ev.target.value;
  }
  handleEmailChange(ev) {
    this.email = ev.target.value;
  }
  handlePasswordChange(ev) {
    this.password = ev.target.value;
  }
  handleConfirmPasswordChange(ev) {
    this.confirmPassword = ev.target.value;
  }
  handleRegister(ev) {
    ev.preventDefault();
    if (this.password !== this.confirmPassword) {
      this.error = "The passwords do not match, try again.";
      return;
    }
    register({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    })
      .then(() => {
        this.modalMessage =
          "Your account has been successfully created.\nYou can login now.";
        this.isModal = true;
      })
      .catch((error) => {
        this.error = error.body.message;
        console.log(this.error);
      });
  }
  handleCloseModal = () => {
    this.isModal = false;
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/login"
      }
    });
  };
  handleNavigateLogin(ev) {
    ev.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/login"
      }
    });
  }
}

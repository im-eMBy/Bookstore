import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getCurrentUserContact from "@salesforce/apex/ShopUserController.getCurrentUserContact";
import sendContactMessage from "@salesforce/apex/ShopController.sendContactMessage";
import basePath from "@salesforce/community/basePath";
import isGuestUser from "@salesforce/user/isGuest";

export default class ShopContactForm extends NavigationMixin(LightningElement) {
  isGuest = isGuestUser;
  contact;

  email = "";
  title = "";
  text = "";

  isModal = false;
  modalMessage;

  connectedCallback() {
    if (!this.isGuest) {
      getCurrentUserContact()
        .then((contact) => {
          this.contact = contact;
          this.email = contact.Email;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleEmailChange(ev) {
    this.email = ev.target.value;
  }
  handleTitleChange(ev) {
    this.title = ev.target.value;
  }
  handleTextChange(ev) {
    this.text = ev.target.value;
  }
  handleSend(ev) {
    ev.preventDefault();
    sendContactMessage({
      email: this.email,
      title: this.title,
      text: this.text
    })
      .then(() => {
        this.text = "";
        this.title = "";
        this.modalMessage = "Your message has been sent.";
        this.isModal = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleCloseModal = () => {
    this.isModal = false;
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath
      }
    });
  };
}

import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import basePath from "@salesforce/community/basePath";
import getCurrentUserContact from "@salesforce/apex/ShopUserController.getCurrentUserContact";
import createOrder from "@salesforce/apex/OrderController.createOrder";
import updateCurrentContact from "@salesforce/apex/ShopUserController.updateCurrentContact";

export default class ShopOrderForm extends NavigationMixin(LightningElement) {
  unfolded = false;
  isModal = false;

  userContact;
  phone;
  email;
  address;
  saveAsDefault = false;
  modalMessage;

  connectedCallback() {
    getCurrentUserContact()
      .then((data) => {
        this.userContact = data;
        this.phone = data.Phone;
        this.email = data.Email;
        this.address = data.MailingAddress;
        if (data.Email === undefined) this.email = "";
        if (data.Phone === undefined) this.phone = "";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleEmailChange(ev) {
    this.email = ev.target.value;
  }
  handlePhoneChange(ev) {
    this.phone = ev.target.value;
  }
  handleAddressChange = (address) => {
    this.address = address;
  };
  handleSaveAsDefaultChange(ev) {
    this.saveAsDefault = ev.target.checked;
  }
  handleOrder(ev) {
    ev.preventDefault();

    if (this.saveAsDefault) {
      updateCurrentContact({
        address: this.address,
        email: this.email,
        phone: this.phone
      }).catch((error) => {
        console.log(error);
      });
    }

    createOrder({
      address: this.address,
      email: this.email,
      phone: this.phone
    })
      .then(() => {
        this.modalMessage =
          "Your order has been correctly placed.\nThank you for choosing our bookstore.";
        this.isModal = true;
      })
      .catch((error) => {
        this.modalMessage = "Sorry, an error occurred.\n" + error.body.message;
        this.isModal = true;
        console.log(error);
      });
  }
  handleUnfold() {
    const content = this.template.querySelector(".content");
    content.classList.add("content--active");
    content.style.maxHeight = content.scrollHeight + "px";
    this.unfolded = true;
  }
  handleFold() {
    const content = this.template.querySelector(".content");
    content.classList.remove("content--active");
    content.style.maxHeight = null;
    this.unfolded = false;
  }
  handleCloseModal = () => {
    this.isModal = false;
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + "/my-cart"
      }
    });
  };
}

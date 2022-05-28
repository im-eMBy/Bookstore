import { LightningElement } from "lwc";
import getCurrentUserContact from "@salesforce/apex/ShopUserController.getCurrentUserContact";
import updateCurrentContact from "@salesforce/apex/ShopUserController.updateCurrentContact";

export default class ShopMyProfile extends LightningElement {
  isDataLoaded;
  address;
  email;
  phone;
  firstName;
  lastName;

  isModal = false;
  modalMessage;

  connectedCallback() {
    getCurrentUserContact()
      .then((contact) => {
        this.address = contact.MailingAddress;
        this.email = contact.Email;
        this.phone = contact.Phone;
        this.firstName = contact.FirstName;
        this.lastName = contact.LastName;

        if (contact.Email === undefined) this.email = "";
        if (contact.Phone === undefined) this.phone = "";

        this.isDataLoaded = true;
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
  handleSave(ev) {
    ev.preventDefault();
    updateCurrentContact({
      address: this.address,
      email: this.email,
      phone: this.phone
    })
      .then(() => {
        this.modalMessage = "Your data has been saved.";
        this.isModal = true;
      })
      .catch((error) => {
        this.modalMessage = error.body.message;
        this.isModal = true;
        console.log(error);
      });
  }
  handleCloseModal = () => {
    this.isModal = false;
  };
}

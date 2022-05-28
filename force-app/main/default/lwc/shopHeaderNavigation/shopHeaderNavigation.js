import { LightningElement, wire, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { CurrentPageReference } from "lightning/navigation";
import getNavigationItems from "@salesforce/apex/ShopNavigationController.getNavigationItems";
import isGuestUser from "@salesforce/user/isGuest";
import basePath from "@salesforce/community/basePath";

export default class ShopHeaderNavigation extends NavigationMixin(
  LightningElement
) {
  @api navName = "Bar Nav";
  navItems = [];
  isLoaded = false;
  isGuest = isGuestUser;
  error;
  publishedState;

  isMobile = false;
  open = false;
  get isOpen() {
    return this.open;
  }
  set isOpen(value) {
    this.open = value;
    if (value) {
      this.template
        .querySelector(".nav-list--mobile")
        .classList.add("nav-list--mobile-open");
    }
    if (!value) {
      this.template
        .querySelector(".nav-list--mobile")
        .classList.remove("nav-list--mobile-open");
    }
  }

  @wire(getNavigationItems, {
    navName: "$navName",
    publishedState: "$publishedState"
  })
  wiredMenuItems({ error, data }) {
    if (data && !this.isLoaded) {
      this.navItems = data
        .map((item, index) => {
          return {
            target: item.Target,
            id: index,
            label: item.Label,
            defaultListViewId: item.DefaultListViewId,
            type: item.Type,
            accessRestriction: item.AccessRestriction
          };
        })
        .filter((item) => {
          return (
            item.accessRestriction === "None" ||
            (item.accessRestriction === "LoginRequired" && !this.isGuest)
          );
        });
      this.isLoaded = true;
    } else if (error) {
      this.error = error;
      this.navItems = [];
      this.isLoaded = true;
      console.log(`Navigation menu error: ${JSON.stringify(this.error)}`);
    }
  }

  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    const app =
      currentPageReference &&
      currentPageReference.state &&
      currentPageReference.state.app;
    if (app === "commeditor") {
      this.publishedState = "Draft";
    } else {
      this.publishedState = "Live";
    }
  }

  connectedCallback() {
    if (window.innerWidth < 800) this.isMobile = true;
    window.addEventListener("resize", () => {
      if (window.innerWidth < 800) this.isMobile = true;
      if (window.innerWidth >= 800) this.isMobile = false;
    });
  }
  handleMobileOpen = () => {
    this.isOpen = true;
  };
  handleMobileClose = () => {
    this.isOpen = false;
  };
  handleNavigate(ev) {
    if (this.isMobile) this.handleMobileClose();
    ev.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: basePath + ev.currentTarget.dataset.target
      }
    });
  }
}

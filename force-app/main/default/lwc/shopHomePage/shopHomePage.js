import { LightningElement } from "lwc";
import getNews from "@salesforce/apex/ShopController.getNews";

export default class ShopHomePage extends LightningElement {
  news;

  connectedCallback() {
    getNews()
      .then((news) => {
        this.news = news;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

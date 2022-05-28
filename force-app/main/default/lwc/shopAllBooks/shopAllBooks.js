import { LightningElement } from "lwc";
import getAllAvailableBooks from "@salesforce/apex/BooksController.getAllAvailableBooks";
import getBooksTags from "@salesforce/apex/BooksController.getBooksTags";

export default class ShopAllBooks extends LightningElement {
  allBooks;
  tags;
  keyword;
  keywordInput = "";
  currentTag;
  sorting = "name";
  sortDesc;
  get books() {
    if (!this.allBooks) return [];
    let booksList = [...this.allBooks];
    if (this.currentTag) {
      booksList = booksList.filter((book) =>
        book.Tags__c.includes(this.currentTag)
      );
    }
    if (this.keyword) {
      booksList = booksList.filter(
        (book) =>
          book.Name.toLowerCase().includes(this.keyword.toLowerCase()) ||
          book.Author__c.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
    if (this.sorting === "name")
      booksList.sort((a, b) => a.Name.localeCompare(b.Name));
    if (this.sorting === "price")
      booksList.sort((a, b) => a.Price__c - b.Price__c);
    if (this.sorting === "rating")
      booksList.sort((a, b) => a.Rating__c - b.Rating__c);
    if (this.sortDesc) booksList.reverse();
    return booksList;
  }

  connectedCallback() {
    getBooksTags()
      .then((tags) => {
        this.tags = tags;
      })
      .catch((error) => {
        console.log(error);
      });
    getAllAvailableBooks()
      .then((books) => {
        this.allBooks = books;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleTagClick(ev) {
    this.currentTag = ev.currentTarget.value;
    const prev = this.template.querySelector(".tag-button--active");
    if (prev) prev.classList.remove("tag-button--active");
    ev.currentTarget.classList.add("tag-button--active");
  }
  handleShowAll() {
    this.currentTag = null;
    const prev = this.template.querySelector(".tag-button--active");
    if (prev) prev.classList.remove("tag-button--active");
  }
  handleKeywordChange(ev) {
    this.keywordInput = ev.target.value;
  }
  handleSearch() {
    this.keyword = this.keywordInput;
    this.keywordInput = "";
  }
  handleClearSearch() {
    this.keyword = null;
  }
  handleSortChange(ev) {
    this.sorting =
      ev.currentTarget.options[ev.currentTarget.selectedIndex].value;
    this.sortDesc =
      ev.currentTarget.options[ev.currentTarget.selectedIndex].dataset.dir ===
      "desc";
  }
}

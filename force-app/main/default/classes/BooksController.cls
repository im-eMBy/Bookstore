public without sharing class BooksController {
  @AuraEnabled(cacheable=true)
  public static Book__c getBook(String Id) {
    return [
      SELECT
        Name,
        Author__c,
        Stock__c,
        ISBN__c,
        Price__c,
        Image_Url__c,
        Tags__c,
        Description__c,
        Pages_nr__c,
        Cover__c,
        Sold__c,
        Rating__c
      FROM Book__c
      WHERE Id = :Id
      LIMIT 1
    ];
  }
  @AuraEnabled(cacheable=false)
  public static List<Book_review__c> getBookReviews(String bookId) {
    return [
      SELECT Name, Author__c, Rating__c, Text__c, Author__r.FirstName
      FROM Book_review__c
      WHERE Book__c = :bookId
      ORDER BY Name DESC
    ];
  }
  @AuraEnabled
  public static void createBookReview(
    String bookId,
    String text,
    Integer rating
  ) {
    Id contactId = ShopUserController.getCurrentUserContactId();
    Book_review__c review = new Book_review__c();
    review.Book__c = bookId;
    review.Author__c = contactId;
    review.Rating__c = rating;
    review.Text__c = text;
    try {
      insert review;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }
  @AuraEnabled
  public static void deleteBookReview(String reviewId) {
    Book_review__c rev = [
      SELECT Name
      FROM Book_review__c
      WHERE Id = :reviewId
      LIMIT 1
    ];
    try {
      delete rev;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }
  @AuraEnabled(cacheable=true)
  public static List<Book__c> getBooks() {
    return [
      SELECT Name, Author__c, Stock__c, ISBN__c, Price__c
      FROM Book__c
      ORDER BY Name
    ];
  }
  @AuraEnabled(cacheable=true)
  public static List<Book__c> getAllAvailableBooks() {
    return [
      SELECT
        Name,
        Author__c,
        Stock__c,
        ISBN__c,
        Price__c,
        Image_Url__c,
        Tags__c,
        Rating__c
      FROM Book__c
      WHERE Stock__c > 0 AND Available__c = TRUE
      ORDER BY Name
    ];
  }
  @AuraEnabled(cacheable=true)
  public static List<Book__c> searchBooks(String keyword) {
    List<List<SObject>> searchResults = [
      FIND :keyword
      IN ALL FIELDS
      RETURNING Book__c(Name, Author__c, Stock__c, ISBN__c, Price__c)
    ];
    return (Book__c[]) searchResults[0];
  }
  @AuraEnabled(cacheable=true)
  public static List<String> getBooksTags() {
    List<String> tags = new List<String>();
    Schema.DescribeFieldResult tagsField = Book__c.Tags__c.getDescribe();
    List<Schema.PicklistEntry> tagsValues = tagsField.getPicklistValues();
    for (Schema.PicklistEntry tag : tagsValues) {
      tags.add(tag.getLabel());
    }
    return tags;
  }
}

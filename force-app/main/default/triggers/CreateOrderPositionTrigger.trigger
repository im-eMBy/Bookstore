trigger CreateOrderPositionTrigger on Order_position__c(before insert) {
  Set<Id> booksIds = new Set<Id>();
  for (Order_position__c pos : Trigger.New) {
    booksIds.add(pos.Book__c);
  }
  List<Book__c> books = [
    SELECT Name, Stock__c, Sold__c
    FROM Book__c
    WHERE Id IN :booksIds
  ];
  Map<Id, Book__c> booksMap = new Map<Id, Book__c>(books);
  List<Book__c> updatedBooks = new List<Book__c>();
  for (Order_position__c pos : Trigger.New) {
    Book__c book = booksMap.get(pos.Book__c);
    //next 'if' - when in some way user tries to order more books than is available in stock
    if (book.Stock__c < pos.Amount__c) {
      pos.addError(
        'Sorry, one of positions cannot be proceed due to the stock level. Edit Your order and try again. ' +
        book.Name +
        ' - stock: ' +
        book.Stock__c +
        ' order amount: ' +
        pos.Amount__c
      );
    }

    book.Stock__c -= pos.Amount__c;
    book.Sold__c += pos.Amount__c;
    updatedBooks.add(book);
  }
  try {
    update updatedBooks;
  } catch (Exception ex) {
    System.debug(ex);
  }
}

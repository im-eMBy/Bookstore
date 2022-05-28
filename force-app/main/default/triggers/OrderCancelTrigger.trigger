trigger OrderCancelTrigger on Online_order__c(after update) {
  for (Online_order__c order : Trigger.New) {
    if (order.Status__c != 'Canceled') {
      return;
    }
    List<Order_position__c> orderPosiotions = OrderController.getOrderPositions(
      order.Id
    );
    List<Book__c> books = new List<Book__c>();

    for (Order_position__c pos : orderPosiotions) {
      pos.Canceled__c = true;
      Book__c book = new Book__c(Id = pos.Book__c);
      book.Sold__c = pos.Book__r.Sold__c - pos.Amount__c;
      book.Stock__c = pos.Book__r.Stock__c + pos.Amount__c;
      books.add(book);
    }
    try {
      update books;
      update orderPosiotions;
    } catch (Exception ex) {
      System.debug(ex);
    }
  }
}

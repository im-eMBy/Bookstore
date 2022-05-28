public without sharing class OrderController {
  public class Address {
    @AuraEnabled
    public String street { get; set; }
    @AuraEnabled
    public String city { get; set; }
    @AuraEnabled
    public String postalCode { get; set; }
    @AuraEnabled
    public String state { get; set; }
    @AuraEnabled
    public String country { get; set; }
  }

  @AuraEnabled
  public static void createOrder(Address address, String email, String phone) {
    Online_order__c newOrder = new Online_order__c();
    newOrder.Street__c = address.street;
    newOrder.City__c = address.city;
    newOrder.Postal_code__c = address.postalCode;
    newOrder.Province__c = address.state;
    newOrder.Country__c = address.country;
    newOrder.Email__c = email;
    newOrder.Phone__c = phone;

    Contact userContact = ShopUserController.getCurrentUserContact();
    newOrder.Customer__c = userContact.Id;

    try {
      insert newOrder;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }

    List<Shopping_cart_position__c> cartPositions = ShopCartController.getCartPositions();

    Set<Id> booksIds = new Set<Id>();
    for (Shopping_cart_position__c pos : cartPositions) {
      booksIds.add(pos.Book__c);
    }
    List<Book__c> books = [
      SELECT Name, Stock__c, Sold__c
      FROM Book__c
      WHERE Id IN :booksIds
    ];
    Map<Id, Book__c> booksMap = new Map<Id, Book__c>(books);
    for (Shopping_cart_position__c pos : cartPositions) {
      Book__c book = booksMap.get(pos.Book__c);
      if (book.Stock__c < pos.Amount__c) {
        throw new AuraHandledException(
          'Sorry, one of positions cannot be proceed due to the stock level. Edit Your order and try again. ' +
          book.Name +
          ' - stock: ' +
          book.Stock__c +
          ' order amount: ' +
          pos.Amount__c
        );
      }
    }

    List<Order_position__c> orderPosiotions = new List<Order_position__c>();
    for (Shopping_cart_position__c cPos : cartPositions) {
      Order_position__c oPos = new Order_position__c();
      oPos.Amount__c = cPos.Amount__c;
      oPos.Book__c = cPos.Book__c;
      oPos.Book_price__c = cPos.Book__r.Price__c;
      oPos.Online_order__c = newOrder.Id;
      orderPosiotions.add(oPos);
    }
    try {
      insert orderPosiotions;
      delete cartPositions;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }

  @AuraEnabled(cacheable=false)
  public static List<Online_order__c> getOrders() {
    Contact userContact = ShopUserController.getCurrentUserContact();

    return [
      SELECT Name, Status__c, Total_value__c, Created_date__c
      FROM Online_order__c
      WHERE Customer__c = :userContact.Id
      ORDER BY Name DESC
    ];
  }

  @AuraEnabled(cacheable=true)
  public static Online_order__c getOrder(Id orderId) {
    return [
      SELECT
        Name,
        Status__c,
        Total_value__c,
        Created_date__c,
        Street__c,
        City__c,
        Postal_code__c,
        Province__c,
        Country__c
      FROM Online_order__c
      WHERE Id = :orderId
      LIMIT 1
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<Order_position__c> getOrderPositions(Id orderId) {
    return [
      SELECT
        Book_price__c,
        Amount__c,
        Value__c,
        Book__c,
        Canceled__c,
        Book__r.Name,
        Book__r.Stock__c,
        Book__r.Sold__c,
        Book__r.Image_Url__c
      FROM Order_position__c
      WHERE Online_order__c = :orderId
    ];
  }

  @AuraEnabled
  public static void cancelOrder(Id orderId) {
    Online_order__c order = OrderController.getOrder(orderId);
    if (order.Status__c != 'In progress' && order.Status__c != 'New') {
      throw new AuraHandledException(
        'Can not cancel order, with status other than "New" or "In Progress"'
      );
    }
    order.Status__c = 'Canceled';

    try {
      update order;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}

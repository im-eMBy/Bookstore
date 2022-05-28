public without sharing class ShopCartController {
  @AuraEnabled(cacheable=false)
  public static List<Shopping_cart_position__c> getCartPositions() {
    String contactId = ShopUserController.getCurrentUserContactId();
    Shopping_cart__c cart = [
      SELECT Id
      FROM Shopping_cart__c
      WHERE Owner__c = :contactId
      LIMIT 1
    ];
    List<Shopping_cart_position__c> positions = [
      SELECT
        Id,
        Amount__c,
        Value__c,
        Book__c,
        Book__r.Name,
        Book__r.Author__c,
        Book__r.Price__c,
        Book__r.Image_Url__c,
        Book__r.Stock__c
      FROM Shopping_cart_position__c
      WHERE Shopping_cart__c = :cart.Id
    ];
    return positions;
  }

  @AuraEnabled
  public static void addToCart(Integer amount, Book__c book) {
    String contactId = ShopUserController.getCurrentUserContactId();
    Shopping_cart__c cart = [
      SELECT Id
      FROM Shopping_cart__c
      WHERE Owner__c = :contactId
      LIMIT 1
    ];

    //check if book is already added to cart, if it is change position 'amount'
    List<Shopping_cart_position__c> positions = [
      SELECT Id, Amount__c, Book__c
      FROM Shopping_cart_position__c
      WHERE Shopping_cart__c = :cart.Id
    ];
    for (Shopping_cart_position__c p : positions) {
      if (p.Book__c == book.Id) {
        p.Amount__c += amount;
        try {
          update p;
        } catch (Exception ex) {
          throw new AuraHandledException(ex.getMessage());
        }
        return;
      }
    }

    //insert new position (only if there is no position with referenced book in cart)
    Shopping_cart_position__c newPosition = new Shopping_cart_position__c(
      Amount__c = amount,
      Book__c = book.Id,
      Shopping_cart__c = cart.Id
    );

    try {
      insert newPosition;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }

  @AuraEnabled
  public static void removeFromCart(Id positionId) {
    Shopping_cart_position__c position = [
      SELECT Id
      FROM Shopping_cart_position__c
      WHERE Id = :positionId
      LIMIT 1
    ];
    try {
      delete position;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }

  @AuraEnabled
  public static Integer checkIfInCart(Id bookId) {
    String contactId = ShopUserController.getCurrentUserContactId();
    List<Shopping_cart_position__c> pos = [
      SELECT Amount__c
      FROM Shopping_cart_position__c
      WHERE Shopping_cart__r.Owner__c = :contactId AND Book__c = :bookId
      LIMIT 1
    ];
    if (pos.isEmpty()) {
      return 0;
    }
    return pos[0].Amount__c.intValue();
  }

  @AuraEnabled
  public static void editAmount(Id positionId, Integer amount) {
    Shopping_cart_position__c pos = [
      SELECT Amount__c
      FROM Shopping_cart_position__c
      WHERE Id = :positionId
      LIMIT 1
    ];
    pos.Amount__c = amount;
    try {
      update pos;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}

public without sharing class ShopController {
  @AuraEnabled(cacheable=true)
  public static List<Shop_news__c> getNews() {
    return [
      SELECT Text__c, Created_date__c, Name
      FROM Shop_news__c
      ORDER BY Created_date__c DESC
    ];
  }
  @AuraEnabled
  public static void sendContactMessage(
    String email,
    String title,
    String text
  ) {
    Customer_message__c msg = new Customer_message__c();
    msg.Email__c = email;
    msg.Title__c = title;
    msg.Text__c = text;
    List<Contact> contact = [SELECT Name FROM Contact WHERE Email = :email];
    if (contact.size() > 0) {
      msg.Contact__c = contact[0].Id;
    }
    try {
      insert msg;
    } catch (Exception ex) {
      throw new AuraHandledException(ex.getMessage());
    }
  }
}

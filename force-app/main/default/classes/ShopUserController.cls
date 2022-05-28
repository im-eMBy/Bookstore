public without sharing class ShopUserController {
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
  public static void register(
    String email,
    String firstName,
    String lastName,
    String password
  ) {
    User user = new User();
    user.Email = email;
    user.FirstName = firstName;
    user.LastName = lastName;
    user.Username = email;
    user.CommunityNickname = user.Username;

    Id userId = Site.createExternalUser(user, null, password);
  }

  @AuraEnabled
  public static String login(String email, String password) {
    List<User> userAccount = [
      SELECT Username
      FROM User
      WHERE Contact.Email = :email
    ];
    if (userAccount.size() == 0) {
      throw new AuraHandledException('User not exists');
    }
    String startUrl = '/shop';
    return Site.login(userAccount[0].Username, password, startUrl).getUrl();
  }

  @AuraEnabled(cacheable=false)
  public static String getCurrentUserContactId() {
    String userId = UserInfo.getUserId();
    //next line for testing only
    // userId = '005IY000000WSgKYAW';
    User user = [SELECT Id, ContactId FROM User WHERE Id = :userId LIMIT 1];
    return user.ContactId;
  }

  @AuraEnabled
  public static Contact getCurrentUserContact() {
    String userId = UserInfo.getUserId();
    // next line for testing only
    // userId = '005IY000000WSgKYAW';
    User user = [SELECT Id, ContactId FROM User WHERE Id = :userId LIMIT 1];
    return [
      SELECT MailingAddress, Phone, Email, Name, FirstName, LastName
      FROM Contact
      WHERE Id = :user.ContactId
      LIMIT 1
    ];
  }

  @AuraEnabled
  public static void updateCurrentContact(
    Address address,
    String email,
    String phone
  ) {
    Contact contact = ShopUserController.getCurrentUserContact();
    contact.MailingStreet = address.street;
    contact.MailingCity = address.city;
    contact.MailingPostalCode = address.postalCode;
    contact.MailingState = address.state;
    contact.MailingCountry = address.country;
    contact.Phone = phone;
    contact.Email = email;
    try {
      update contact;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}

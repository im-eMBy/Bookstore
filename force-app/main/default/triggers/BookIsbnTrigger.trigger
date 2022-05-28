trigger BookIsbnTrigger on Book__c(before insert, before update) {
  for (Book__c book : Trigger.New) {
    if (String.isBlank(book.ISBN__c)) {
      return;
    }
    Integer isbnLength = book.ISBN__c.length();
    if (isbnLength != 10 && isbnLength != 13) {
      book.ISBN__c.addError('ISBN number should be 10 or 13 digits long!');
      return;
    }
    //prepering variables for further validation
    List<Integer> digits = new List<Integer>();
    List<String> nonParsedDigits = book.ISBN__c.split('');
    for (String str : nonParsedDigits) {
      try {
        Integer parsedDigit = Integer.valueOf(str);
        digits.add(parsedDigit);
      } catch (Exception ex) {
        System.debug(ex);
        book.ISBN__c.addError('Invalid ISBN number! (Non-digit character...)');
        return;
      }
    }
    Integer controlSum = 0;

    if (isbnLength == 10) {
      for (Integer i = 0; i < digits.size(); i++) {
        controlSum += digits[i] * (10 - i);
      }
      if (Math.mod(controlSum, 11) != 0) {
        book.ISBN__c.addError('Invalid ISBN number!');
      }
    }
    if (isbnLength == 13) {
      for (Integer i = 0; i < digits.size(); i++) {
        Integer position = 13 - i;
        if (Math.mod(position, 2) == 0) {
          controlSum += digits[i] * 3;
        }
        if (Math.mod(position, 2) != 0) {
          controlSum += digits[i] * 1;
        }
      }
      if (Math.mod(controlSum, 10) != 0) {
        book.ISBN__c.addError('Invalid ISBN number!');
      }
    }
  }
}

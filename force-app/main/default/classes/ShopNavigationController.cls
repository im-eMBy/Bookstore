public with sharing class ShopNavigationController {
  @AuraEnabled(cacheable=true)
  public static List<NavigationMenuItem> getNavigationItems(
    String navName,
    String publishedState
  ) {
    System.assert(navName != null);
    System.assert(publishedState != null);
    String networkId = Network.getNetworkId();
    System.assert(networkId != null);

    List<NavigationLinkSet> linkSets = [
      SELECT Id
      FROM NavigationLinkSet
      WHERE MasterLabel = :navName AND NetworkId = :networkId
    ];
    System.assert(linkSets.size() == 1);
    Id linkSetId = linkSets.get(0).Id;

    return [
      SELECT
        toLabel(Label),
        Target,
        Type,
        DefaultListViewId,
        AccessRestriction,
        ParentId,
        Position,
        Status,
        TargetPrefs
      FROM NavigationMenuItem
      WHERE NavigationLinkSetId = :linkSetId AND Status = :publishedState
      ORDER BY Position
    ];
  }
}

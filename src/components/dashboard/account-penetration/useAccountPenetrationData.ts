
import { useMemo } from "react";
import { useHubspot, Account } from "@/context/hubspot";

export const useAccountPenetrationData = () => {
  const { accounts } = useHubspot();

  const accountPenetrationData = useMemo(() => {
    if (!accounts || accounts.length === 0) {
      return [];
    }

    return accounts.map((account: Account) => {
      const totalContacts = account.contacts?.length || 0;
      
      // Calculate MQLs and SQLs based on contact data
      const mqls = account.contacts?.filter(contact => 
        contact.lifecycleStage === 'Marketing Qualified Lead' || 
        contact.lifecycleStage === 'MQL' ||
        contact.priorityLevel === 'medium'
      ).length || 0;
      
      const sqls = account.contacts?.filter(contact => 
        contact.lifecycleStage === 'Sales Qualified Lead' || 
        contact.lifecycleStage === 'SQL' ||
        contact.priorityLevel === 'high'
      ).length || 0;
      
      const penetrationRate = totalContacts > 0 ? 
        ((mqls + sqls) / totalContacts * 100) : 0;
      
      return {
        name: account.name,
        penetration: Math.round(penetrationRate),
        contacts: totalContacts,
        mqls,
        sqls
      };
    }).sort((a, b) => b.penetration - a.penetration);
  }, [accounts]);

  return accountPenetrationData;
};

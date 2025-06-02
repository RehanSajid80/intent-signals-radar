
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
      const penetrationRate = totalContacts > 0 ? 
        ((account.mqls || 0) + (account.sqls || 0)) / totalContacts * 100 : 0;
      
      return {
        ...account,
        penetrationRate: Math.round(penetrationRate),
        totalContacts
      };
    }).sort((a, b) => b.penetrationRate - a.penetrationRate);
  }, [accounts]);

  return {
    accountPenetrationData
  };
};

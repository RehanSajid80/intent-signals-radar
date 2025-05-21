
import { useHubspot, Contact } from "@/context/HubspotContext";

interface AccountData {
  name: string;
  contacts: number;
  mqls: number;
  sqls: number;
  penetration: number;
}

export const useAccountPenetrationData = () => {
  const { accounts, contacts } = useHubspot();
  
  // Group contacts by company
  const companyData = contacts.reduce((acc, contact) => {
    const companyName = contact.company || 'Unknown';
    
    if (!acc[companyName]) {
      acc[companyName] = {
        name: companyName,
        contacts: 0,
        mqls: 0,
        sqls: 0,
        penetration: 0
      };
    }
    
    // Increment total contacts
    acc[companyName].contacts++;
    
    // Check for MQLs
    if (contact.lifecycleStage === 'Marketing Qualified Lead' || 
        contact.lifecycleStage === 'MQL' ||
        contact.priorityLevel === 'medium') {
      acc[companyName].mqls++;
    }
    
    // Check for SQLs
    if (contact.lifecycleStage === 'Sales Qualified Lead' || 
        contact.lifecycleStage === 'SQL' ||
        contact.priorityLevel === 'high') {
      acc[companyName].sqls++;
    }
    
    return acc;
  }, {} as Record<string, { name: string; contacts: number; mqls: number; sqls: number; penetration: number }>);

  // Calculate penetration percentage (SQLs + MQLs) / total contacts * 100
  const companiesArray = Object.values(companyData).map(company => {
    const penetrationScore = company.contacts > 0 
      ? Math.round(((company.mqls + company.sqls) / company.contacts) * 100)
      : 0;
    
    return {
      ...company,
      penetration: penetrationScore
    };
  });

  return companiesArray;
};

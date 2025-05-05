
import { IntentData } from "../../../types/intentTypes";

/**
 * Helper function to convert database rows to frontend IntentData format
 */
export const convertDbRowsToIntentData = (rows: any[]): IntentData[] => {
  return rows.map(item => ({
    intentId: item.id,
    date: item.date,
    companyName: item.company_name,
    topic: item.topic,
    category: item.category,
    score: item.score,
    website: item.website || '',
    secondaryIndustryHierarchicalCategory: item.secondary_industry_hierarchical_category || '',
    alexaRank: item.alexa_rank?.toString() || '',
    employees: item.employees?.toString() || '',
    weekLabel: (item as any).week_label || '',
    // Fill other fields as empty strings
    companyId: '',
    foundedYear: '',
    companyHQPhone: '',
    revenue: '',
    primaryIndustry: '',
    primarySubIndustry: '',
    allIndustries: '',
    allSubIndustries: '',
    industryHierarchicalCategory: '',
    linkedInUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    certifiedActiveCompany: '',
    certificationDate: '',
    totalFundingAmount: '',
    recentFundingAmount: '',
    recentFundingRound: '',
    recentFundingDate: '',
    recentInvestors: '',
    allInvestors: '',
    companyStreetAddress: '',
    companyCity: '',
    companyState: '',
    companyZipCode: '',
    companyCountry: '',
    fullAddress: '',
    numberOfLocations: '',
    queryName: '',
  }));
};

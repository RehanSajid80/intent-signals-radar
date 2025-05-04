
// Define the structure for intent data
export interface IntentData {
  intentId: string;
  date: string;
  companyName: string;
  topic: string;
  category: string;
  score: number;
  website: string;
  secondaryIndustryHierarchicalCategory: string;
  alexaRank: string;
  employees: string;
  companyId: string;
  foundedYear: string;
  companyHQPhone: string;
  revenue: string;
  primaryIndustry: string;
  primarySubIndustry: string;
  allIndustries: string;
  allSubIndustries: string;
  industryHierarchicalCategory: string;
  linkedInUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  certifiedActiveCompany: string;
  certificationDate: string;
  totalFundingAmount: string;
  recentFundingAmount: string;
  recentFundingRound: string;
  recentFundingDate: string;
  recentInvestors: string;
  allInvestors: string;
  companyStreetAddress: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  companyCountry: string;
  fullAddress: string;
  numberOfLocations: string;
  queryName: string;
}

// Define the database intent data structure
export interface DbIntentData {
  id: string;
  date: string;
  company_name: string;
  topic: string;
  category: string;
  score: number;
  created_at: string;
  user_id: string | null;
  website?: string | null;
  secondary_industry_hierarchical_category?: string | null;
  alexa_rank?: number | null;
  employees?: number | null;
}

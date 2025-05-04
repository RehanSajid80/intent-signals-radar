
import { IntentData } from "../../types/intentTypes";

/**
 * Transform a raw CSV row into an IntentData object
 */
export const transformRowToIntentData = (row: Record<string, string>): IntentData => {
  return {
    intentId: row['Intent ID'] || '',
    date: row['Date'] || '',
    companyName: row['Company Name'] || '',
    topic: row['Topic'] || '',
    category: row['Category'] || '',
    score: parseInt(row['Score'] || '0'),
    website: row['Website'] || '',
    secondaryIndustryHierarchicalCategory: row['Secondary Industry Hierarchical Category'] || '',
    alexaRank: row['Alexa Rank'] || '',
    employees: row['Employees'] || '',
    companyId: row['Company ID'] || '',
    foundedYear: row['Founded Year'] || '',
    companyHQPhone: row['Company HQ Phone'] || '',
    revenue: row['Revenue (in 000s USD)'] || '',
    primaryIndustry: row['Primary Industry'] || '',
    primarySubIndustry: row['Primary Sub-Industry'] || '',
    allIndustries: row['All Industries'] || '',
    allSubIndustries: row['All Sub-Industries'] || '',
    industryHierarchicalCategory: row['Industry Hierarchical Category'] || '',
    linkedInUrl: row['LinkedIn Company Profile URL'] || '',
    facebookUrl: row['Facebook Company Profile URL'] || '',
    twitterUrl: row['Twitter Company Profile URL'] || '',
    certifiedActiveCompany: row['Certified Active Company'] || '',
    certificationDate: row['Certification Date'] || '',
    totalFundingAmount: row['Total Funding Amount (in 000s USD)'] || '',
    recentFundingAmount: row['Recent Funding Amount (in 000s USD)'] || '',
    recentFundingRound: row['Recent Funding Round'] || '',
    recentFundingDate: row['Recent Funding Date'] || '',
    recentInvestors: row['Recent Investors'] || '',
    allInvestors: row['All Investors'] || '',
    companyStreetAddress: row['Company Street Address'] || '',
    companyCity: row['Company City'] || '',
    companyState: row['Company State'] || '',
    companyZipCode: row['Company Zip Code'] || '',
    companyCountry: row['Company Country'] || '',
    fullAddress: row['Full Address'] || '',
    numberOfLocations: row['Number of Locations'] || '',
    queryName: row['Query Name'] || '',
  };
};

/**
 * Parse CSV text into IntentData objects
 */
export const processCSVData = (text: string): IntentData[] => {
  try {
    const rows = text.split('\n');
    if (rows.length < 2) {
      throw new Error("CSV file is empty or invalid");
    }
    
    // Get headers
    const headers = rows[0].split(',').map(h => h.trim());
    const requiredHeaders = ['Date', 'Company Name', 'Topic', 'Category', 'Score'];
    const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
    
    if (!hasRequiredHeaders) {
      throw new Error("CSV file must contain these columns: Date, Company Name, Topic, Category, Score");
    }
    
    // Process all rows for full analysis
    const processedData = rows.slice(1).map(row => {
      if (!row.trim()) return null; // Skip empty rows
      
      const values = row.split(',');
      const rowData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index]?.trim() || '';
      });
      
      // Map to our expected format
      return {
        intentId: '', // Generate later
        date: rowData['Date'] || '',
        companyName: rowData['Company Name'] || '',
        topic: rowData['Topic'] || '',
        category: rowData['Category'] || '',
        score: parseInt(rowData['Score'] || '0'),
        website: rowData['Website'] || '',
        secondaryIndustryHierarchicalCategory: rowData['Secondary Industry Hierarchical Category'] || '',
        alexaRank: rowData['Alexa Rank'] || '',
        employees: rowData['Employees'] || '',
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
      };
    }).filter(Boolean) as IntentData[];
    
    return processedData;
  } catch (err) {
    console.error("Error parsing CSV:", err);
    throw err;
  }
};

/**
 * Create a preview of IntentData from CSV text
 */
export const createCSVPreview = (text: string): IntentData[] => {
  try {
    const rows = text.split('\n');
    if (rows.length < 2) {
      throw new Error("CSV file is empty or invalid");
    }
    
    const headers = rows[0].split(',').map(h => h.trim());
    const requiredHeaders = ['Date', 'Company Name', 'Topic', 'Category', 'Score'];
    const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
    
    if (!hasRequiredHeaders) {
      throw new Error("CSV file must contain these columns: Date, Company Name, Topic, Category, Score");
    }
    
    // Process a few rows for preview (up to 3)
    const previewRows = rows.slice(1, 4).map(row => {
      if (!row.trim()) return null;
      
      const values = row.split(',');
      const rowData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index]?.trim() || '';
      });
      
      // Map to our expected format with minimal data for preview
      return {
        intentId: '',
        date: rowData['Date'] || '',
        companyName: rowData['Company Name'] || '',
        topic: rowData['Topic'] || '',
        category: rowData['Category'] || '',
        score: parseInt(rowData['Score'] || '0'),
        website: rowData['Website'] || '',
        secondaryIndustryHierarchicalCategory: rowData['Secondary Industry Hierarchical Category'] || '',
        alexaRank: rowData['Alexa Rank'] || '',
        employees: rowData['Employees'] || '',
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
      };
    }).filter(Boolean) as IntentData[];
    
    return previewRows;
  } catch (err) {
    console.error("Error creating CSV preview:", err);
    throw err;
  }
};


export type CloudProviderDetails = {
  aws: string;
  azure: string;
  googleCloud: string;
  oracle: string;
};

export type CloudProviders = {
  aws?: boolean;
  azure?: boolean;
  googleCloud?: boolean;
  oracle?: boolean;
  details?: CloudProviderDetails;
};

export type AnalyzedAccount = {
  id: string;
  name: string;
  url: string;
  cloudProviders: CloudProviders;
};

export const ELEVANCE_DATA: CloudProviderDetails = {
  aws: "Infrastructure and data engineering for scalable, secure environments.",
  azure: "Hosting and network presence across geographical points-of-presence.",
  googleCloud: "Data engineering and analytics, integrated with Snowflake for data warehousing.",
  oracle: "Human Capital Management (HCM) for performance and goal management."
};

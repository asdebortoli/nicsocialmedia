export type CaseStudy = {
  id: string;
  companyId: string;
  title: string;
  thumbnailUrl: string;
  order: number;
  description?: string;
  link?: string;
};

export type CompanyWithCases = {
  id: string;
  name: string;
  order: number;
  logoUrl?: string;
  description?: string;
  cases: CaseStudy[];
};

import { CompanyWithCases } from "@/lib/types/content";

const mockedCompanies: CompanyWithCases[] = [
  {
    id: "company-1",
    name: "Empresa 1",
    order: 1,
    cases: [
      {
        id: "case-1",
        companyId: "company-1",
        title: "Case 1",
        description: "Case 1",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 1,
      },
      {
        id: "case-2",
        companyId: "company-1",
        title: "Case 2",
        description: "Case 2",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 2,
      },
      {
        id: "case-3",
        companyId: "company-1",
        title: "Case 3",
        description: "Case 3",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 3,
      },
    ],
  },
  {
    id: "company-2",
    name: "Empresa 2",
    order: 2,
    cases: [
      {
        id: "case-4",
        companyId: "company-2",
        title: "Case 1",
        description: "Case 1",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 1,
      },
      {
        id: "case-5",
        companyId: "company-2",
        title: "Case 2",
        description: "Case 2",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 2,
      },
      {
        id: "case-6",
        companyId: "company-2",
        title: "Case 3",
        description: "Case 3",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 3,
      },
      {
        id: "case-7",
        companyId: "company-2",
        title: "Case 4",
        description: "Case 4",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 4,
      },
      {
        id: "case-8",
        companyId: "company-2",
        title: "Case 5",
        description: "Case 5",
        thumbnailUrl: "https://picsum.photos/150",
        link: "https://www.google.com",
        order: 5,
      },
    ],
  },
];

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * Fetches companies and their cases for the public website.
 * Swap this mock with a real API call when backend routes are ready.
 */
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function fetchCompaniesWithCases(): Promise<CompanyWithCases[]> {
  try {
    const response = await fetch(`${baseUrl}/posts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const companiesWithPosts = await response.json();
    
    const companiesWithCases: CompanyWithCases[] = companiesWithPosts.map((company: any, index: number) => ({
        id: company.id,
        name: company.name,
        order: index + 1,
        cases: company.posts.map((post: any, postIndex: number) => ({
          id: post._id,
          companyId: company.id,
          title: post.title,
          description: post.description,
          thumbnailUrl: post.thumbnailUrl,
          link: post.link,
          order: postIndex + 1,
        }))
      }
    ));

    return sortByOrder(companiesWithCases).map((company) => ({
      ...company,
      cases: sortByOrder(company.cases),
    }));
    
  } catch (error) {
    console.error('Error fetching companies with cases:', error);
    // Fallback to mock data in case of error
    return sortByOrder(mockedCompanies).map((company) => ({
      ...company,
      cases: sortByOrder(company.cases),
    }));
  }
}

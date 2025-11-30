import { CompanyWithCases } from "@/lib/types/content";
import { apiGet } from "./instance";

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

export function convertPostsToCases(posts: any[]): CompanyWithCases[] {
  const companiesWithCases: CompanyWithCases[] = posts.map(
    (company: any, index: number) => ({
      id: company.id,
      name: company.name,
      order: company.order,
      cases: company.cases.map((post: any) => ({
        id: post._id,
        companyId: company.id,
        title: post.title,
        description: post.description,
        thumbnailUrl: post.thumbnailUrl || "https://picsum.photos/150",
        link: post.link || "https://www.google.com",
        order: post.order,
      })),
    })
  );

  return companiesWithCases;
}

/**
 * Fetches companies and their cases for the public website.
 * Swap this mock with a real API call when backend routes are ready.
 */

export async function fetchCompaniesWithCases(): Promise<CompanyWithCases[]> {
  try {
    const companiesWithPosts = await apiGet("/posts");
    return convertPostsToCases(companiesWithPosts);
  } catch (error) {
    console.error("Error fetching companies with cases:", error);
    // Fallback to mock data in case of error
    return mockedCompanies;
  }
}

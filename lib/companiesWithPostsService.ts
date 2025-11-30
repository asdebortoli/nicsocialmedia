import { getAllPosts } from "@/models/post";
import { connectDB } from "@/lib/db/mongodb";

interface Post {
  _id: string;
  company: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: Date;
  link: string;
  authorId: string;
  order: number;
}

interface CompanyWithPosts {
  id: string;
  name: string;
  order: number;
  cases: Post[];
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export async function companiesWithPosts(): Promise<CompanyWithPosts[]> {
  await connectDB();
  const posts = await getAllPosts();
  const companiesMap = new Map<string, Post[]>();
  
  posts.forEach((post: Post) => {
    const companyName = post.company;
    if (!companiesMap.has(companyName)) {
      companiesMap.set(companyName, []);
    }
    post.order = companiesMap.get(companyName)!.length + 1;
    companiesMap.get(companyName)!.push(post);
  });
  
  const companiesWithPosts: CompanyWithPosts[] = Array.from(companiesMap.entries()).map(
    ([companyName, companyPosts]) => ({
      id: companyName.toLowerCase().replace(/\s+/g, '-'),
      name: companyName,
      order: Array.from(companiesMap.keys()).indexOf(companyName) + 1,
      cases: companyPosts,
    })
  );
  return sortByOrder(companiesWithPosts).map((company) => ({
    ...company,
    cases: sortByOrder(company.cases),
  }));
};
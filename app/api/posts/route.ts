import connectDB from "@/lib/db/mongodb";
import { addPost } from "@/models/post";
import path from "path";
import { writeFile } from "fs/promises";
import { HTTP_STATUS } from "@/lib/utils";
import { auth, AuthenticatedRequest } from "@/lib/auth";
import { USER_ROLES } from "@/lib/utils";
import { NextRequest } from "next/server";
import { companiesWithPosts } from "@/lib/companiesWithPostsService";

export async function GET(request: Request) {
  try {
    const companies = await companiesWithPosts();
    return new Response(JSON.stringify(companies), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { 
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    let res = await auth({allowedGroup: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR] }, request);
    if (res) return res;

    const formData = await request.formData();
    const img = formData.get("image");

    if (!img) {
      return Response.json({ error: "No image received." }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    if (!(img instanceof File)) {
      return Response.json({ error: "Invalid image file." }, { status: HTTP_STATUS.BAD_REQUEST });
    }

    const type = img.type;
    if (type !== "image/jpeg"&& type !== "image/jpeg" && type !== "image/png" && type !== "image/webp") {
      return Response.json({ error: "Unsupported image format. Please upload JPEG, PNG, or WEBP." }, { status: HTTP_STATUS.BAD_REQUEST });
    }
    
    const { title, description, company, link } = Object.fromEntries(formData.entries()) as {
      title: string;
      description: string;
      company: string;
      link: string;
    };

    const authorId = (request as AuthenticatedRequest).userId as string;

    const newPost = await addPost(title, description, company, link, authorId);
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${newPost._id}.${img.type.split("/")[1]}`;
    
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );
    newPost.thumbnailUrl = `/uploads/${filename}`;
    newPost.save();
    return new Response(JSON.stringify(newPost), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), { 
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
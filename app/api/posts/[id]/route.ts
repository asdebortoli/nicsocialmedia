import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { getPostById, deletePostById } from "@/models/post";
import { auth, AuthenticatedRequest} from "@/lib/auth";
import { USER_ROLES, HTTP_STATUS } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/blob";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const id = request.url.split('/').pop()!;

        const post = await getPostById(id);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), { 
                status: HTTP_STATUS.NOT_FOUND,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        return new Response(JSON.stringify(post), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        let res = await auth({allowedGroup: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR] }, request);
        if (res) return res;

        const id = request.url.split('/').pop()!;

        const post = await getPostById(id);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), { 
                status: HTTP_STATUS.NOT_FOUND,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const req = request as AuthenticatedRequest;
        console.log(req.userId, req.userRole);
        if (post.authorId !== req.userId && req.userRole !== USER_ROLES.ADMIN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: HTTP_STATUS.UNAUTHORIZED,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const formData = await request.formData();
        const img = formData.get("image");
        if (img) {
            if (!(img instanceof File)) {
                return Response.json({ error: "Invalid image file." }, { status: HTTP_STATUS.BAD_REQUEST });
            }

            const type = img.type;
            if (type !== "image/jpeg" && type !== "image/png" && type !== "image/jpeg" && type !== "image/webp") {
                return Response.json({ error: "Unsupported image format. Please upload JPEG, PNG, or WEBP." }, { status: HTTP_STATUS.BAD_REQUEST });
            }
            
            // Delete old image from blob storage if it exists
            if (post.thumbnailUrl && post.thumbnailUrl.startsWith('http')) {
                await deleteImage(post.thumbnailUrl);
            }
            
            const buffer = Buffer.from(await img.arrayBuffer());
            const filename = `posts/${post._id}.${img.type.split("/")[1]}`;

            // Upload new image to Vercel Blob Storage
            const imageUrl = await uploadImage(buffer, filename, img.type);
            post.thumbnailUrl = imageUrl;
        }
        const { title, description, company, link } = Object.fromEntries(formData.entries()) as {
            title: string;
            description: string;
            company: string;
            link: string;
        };

        if (title) post.title = title;
        if (description) post.description = description;
        if (company) post.company = company;
        if (link) post.link = link;

        post.save();
        return new Response(JSON.stringify(post), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error updating post:', error);
        return new Response(JSON.stringify({ error: 'Failed to update post' }), { 
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        let res = await auth({allowedGroup: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR] }, request);
        if (res) return res;

        const id = request.url.split('/').pop()!;

        const post = await getPostById(id);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), { 
                status: HTTP_STATUS.NOT_FOUND,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const req = request as AuthenticatedRequest;
        if (post.authorId !== req.userId && req.userRole !== USER_ROLES.ADMIN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: HTTP_STATUS.UNAUTHORIZED,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Delete image from blob storage if it exists
        if (post.thumbnailUrl && post.thumbnailUrl.startsWith('http')) {
            await deleteImage(post.thumbnailUrl);
        }
        
        const deletedPost = await deletePostById(id);
        return new Response(JSON.stringify(deletedPost), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete post' }), { 
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
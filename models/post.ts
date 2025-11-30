import post from "@/lib/db/schemas/post";

export async function getAllPosts() {
    return await post.find();
}

export async function getPostById(id: string){
    return await post.findById(id);
}

export async function getPostsByAuthorId(authorId: string) {
    return await post.find({ authorId: authorId });
}

export async function addPost(title: string, description: string, company: string, link: string, authorId: string){
    const newPost = new post({
        title: title,
        description: description,
        company: company,
        link: link,
        authorId: authorId,
        createdAt: new Date()
    });

    return await newPost.save();
}

export async function deletePostById(id: string){
    return await post.findByIdAndDelete(id);
}

export async function deletePostsByAuthorId(authorId: string){
    return await post.deleteMany({ authorId: authorId });
}
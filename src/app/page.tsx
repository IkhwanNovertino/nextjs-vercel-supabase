// src/app/page.tsx

import { createPost, deletePost } from "@/lib/action";
import prisma from "@/lib/db";


export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js Supabase Blog</h1>

      <div className="w-full max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
        <form action={createPost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Post
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post: any) => (
              <li key={post.id} className="border p-4 rounded-md shadow-sm">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const id = formData.get("id") as string;
                    await deletePost(id);
                  }}
                  className="mt-2"
                >
                  <input type="hidden" name="id" id="id" value={post.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
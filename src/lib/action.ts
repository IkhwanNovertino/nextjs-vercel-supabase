// src/lib/action.ts
'use server'; // This directive makes all exports in this file server actions

import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import prisma from './db';

// --- Database Actions (Prisma) ---

export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    throw new Error("Data tidak lengkap");
    // return { error: 'Title and content are required.' };
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    revalidatePath('/'); // Revalidate the home page to show new post
  } catch (error) {
    console.error('Error creating post:', error);
    // return { error: 'Failed to create post.' };
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath('/'); // Revalidate the home page
  } catch (error) {
    console.error('Error deleting post:', error);
    // return { error: 'Failed to delete post.' };
  }
}

// --- Supabase Storage Actions ---

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file uploaded.' };
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from('public-files') // Replace with your bucket name
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading file:', error);
    return { error: 'Failed to upload file.' };
  }

  const publicUrl = supabase.storage.from('public-files').getPublicUrl(fileName).data.publicUrl;

  revalidatePath('/upload'); // Assuming you have an upload page
  return { success: 'File uploaded successfully!', publicUrl };
}

export async function deleteFile(fileName: string) {
  const { error } = await supabase.storage.from('public-files').remove([fileName]);

  if (error) {
    console.error('Error deleting file:', error);
    return { error: 'Failed to delete file.' };
  }

  revalidatePath('/upload');
  return { success: 'File deleted successfully!' };
}
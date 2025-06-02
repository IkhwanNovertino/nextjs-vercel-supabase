
// src/app/upload/page.tsx
import { uploadFile, deleteFile } from '@/lib/action';
import { supabase } from '@/lib/supabase';

interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag?: string;
    mimetype?: string;
    size?: number;
    cacheControl?: string;
  };
}

async function getFiles() {
  const { data, error } = await supabase.storage.from('public-files').list();
  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }
  return data || [];
}

export default async function UploadPage() {
  const files = await getFiles();

  const handleUpload = async (data: FormData) => {
    'use server'
    await uploadFile(data);
  }
  const handleDeleteFile = async (data: FormData) => {
    'use server'
    const fileName = data.get("fileName") as string;
    await deleteFile(fileName)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">File Upload with Supabase Storage</h1>

      <div className="w-full max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upload New File</h2>
        <form action={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Choose File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              required
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Upload File
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {files.map((file: FileObject) => (
              <li key={file.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{file.name}</p>
                  <a
                    href={supabase.storage.from('public-files').getPublicUrl(file.name).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View File
                  </a>
                  <p className="text-sm text-gray-500">Size: {((file.metadata?.size ?? 0) / 1024).toFixed(2)} KB</p>
                </div>
                <form action={handleDeleteFile}>
                  <input type="hidden" name="fileName" value={file.name} />
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
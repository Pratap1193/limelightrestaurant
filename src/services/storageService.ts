import { supabase } from '../config/supabase';
import { PostgrestError } from '@supabase/supabase-js';

const STORAGE_BUCKET = 'restaurant-images';

// Upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  folder: string = 'general'
): Promise<{ path: string | null; url: string | null; error: PostgrestError | null }> => {
  try {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { path: null, url: null, error };
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return { path: data.path, url: publicData.publicUrl, error: null };
  } catch (err: any) {
    return { path: null, url: null, error: err };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  folder: string = 'general'
): Promise<{ results: Array<{ path: string | null; url: string | null; error: PostgrestError | null }>; errors: Array<PostgrestError | null> }> => {
  const results = [];
  const errors = [];

  for (const file of files) {
    const result = await uploadImage(file, folder);
    results.push(result);
    if (result.error) {
      errors.push(result.error);
    }
  }

  return { results, errors };
};

// Delete image from storage
export const deleteStorageImage = async (filepath: string): Promise<{ error: PostgrestError | null }> => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filepath]);

  return { error };
};

// Get public URL for image
export const getImagePublicUrl = async (filepath: string): Promise<{ url: string | null; error: PostgrestError | null }> => {
  try {
    const { data, error } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filepath);

    if (error) {
      return { url: null, error };
    }

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
};

// List files in a folder
export const listFilesInFolder = async (folder: string): Promise<{ files: any[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  return { files: data, error };
};

// Delete folder
export const deleteStorageFolder = async (folderPath: string): Promise<{ error: PostgrestError | null }> => {
  const { data: files, error: listError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(folderPath);

  if (listError) {
    return { error: listError };
  }

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${folderPath}/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filePaths);

    if (deleteError) {
      return { error: deleteError };
    }
  }

  return { error: null };
};

// Get storage usage
export const getStorageUsage = async (): Promise<{ usage: number | null; error: PostgrestError | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('');

    if (error) {
      return { usage: null, error };
    }

    let totalSize = 0;
    const calculateSize = async (folder: string) => {
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(folder);

      if (files) {
        for (const file of files) {
          if (file.metadata) {
            totalSize += file.metadata.size || 0;
          }
        }
      }
    };

    // Calculate recursively for all folders
    if (data) {
      for (const item of data) {
        if (item.id === '') {
          await calculateSize(item.name);
        }
      }
    }

    return { usage: totalSize, error: null };
  } catch (err: any) {
    return { usage: null, error: err };
  }
};

// Download image
export const downloadImage = async (filepath: string): Promise<{ blob: Blob | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(filepath);

  return { blob: data, error };
};

// Move/Rename file
export const moveStorageFile = async (from: string, to: string): Promise<{ error: PostgrestError | null }> => {
  try {
    // Download the file
    const { blob, error: downloadError } = await downloadImage(from);

    if (downloadError || !blob) {
      return { error: downloadError };
    }

    // Upload to new location
    const file = new File([blob], to.split('/').pop() || 'file', { type: blob.type });
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(to, file);

    if (uploadError) {
      return { error: uploadError };
    }

    // Delete original
    const { error: deleteError } = await deleteStorageImage(from);

    return { error: deleteError };
  } catch (err: any) {
    return { error: err };
  }
};

// Create signed URL for private access
export const createSignedUrl = async (
  filepath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: PostgrestError | null }> => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filepath, expiresIn);

  return { url: data?.signedUrl || null, error };
};

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useImageUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
    if (!user) {
      toast.error("Please log in to upload images");
      return [];
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...uploadedUrls]);
        toast.success(`Successfully uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''}`);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload images");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const userFolder = urlParts[urlParts.length - 2];
      const fullPath = `${userFolder}/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fullPath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error("Failed to delete image");
        return false;
      }

      // Remove from local state
      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      toast.success("Image deleted successfully");
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete image");
      return false;
    }
  };

  const clearImages = () => {
    setUploadedImages([]);
  };

  return {
    uploadImages,
    removeImage,
    clearImages,
    uploading,
    uploadedImages,
    setUploadedImages
  };
};
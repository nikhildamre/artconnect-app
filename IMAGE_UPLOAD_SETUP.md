# Image Upload Setup Instructions

## Step 1: Setup Storage Bucket
1. Go to your Supabase Dashboard → SQL Editor
2. Run the `SETUP_STORAGE.sql` script to create the storage bucket and policies

## Step 2: Test Image Upload
1. Go to your app → Profile → Vendor Dashboard → My Products
2. Click "Add" to add a new product
3. Click "Upload Images" and select image files
4. Fill in the product details and save

## Features Added:
✅ **Image Upload Component** - Drag & drop or click to upload
✅ **Multiple Images** - Upload up to 5 images per product
✅ **Image Preview** - See uploaded images with remove option
✅ **Main Image** - First uploaded image becomes the main product image
✅ **File Validation** - Only images allowed, 5MB max size
✅ **Storage Integration** - Images stored in Supabase Storage
✅ **Security** - Users can only manage their own images

## File Structure:
- `src/hooks/useImageUpload.ts` - Image upload logic
- `src/components/ImageUpload.tsx` - Upload UI component
- `src/pages/AddProduct.tsx` - Updated with image upload
- `SETUP_STORAGE.sql` - Database setup for storage

## Usage:
1. **Upload**: Click "Upload Images" button or drag files
2. **Preview**: See thumbnails of uploaded images
3. **Remove**: Click X button on any image to delete
4. **Main Image**: First image is automatically set as main product image
5. **Save**: Product saves with all uploaded images

The image upload is now fully functional! Users can upload multiple images when adding products, and the images will be stored securely in Supabase Storage.
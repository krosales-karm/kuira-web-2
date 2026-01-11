# Profile Image Upload - Setup Documentation

## Overview
Se ha agregado la funcionalidad de carga de imagen de perfil al formulario de registro de participantes en `/src/routes/participantes/registro/+page.svelte`.

## Changes Made

### 1. Script Section Updates

#### New Variables
```typescript
let selectedProfileFile: File | null = null;
let profileFilePreview: string | null = null;
let uploadingProfile = false;
let profileUploadProgress = 0;
```

#### Updated FormData Interface
```typescript
interface FormData {
  // ... existing fields
  profile_file_id: string | null;
}
```

#### New Functions

##### `uploadProfileFile(file: File): Promise<string | null>`
- **Purpose**: Uploads profile image to Supabase Storage and registers it in the `files` table
- **Validation**: 
  - Only accepts images: JPG, PNG, WEBP, GIF
  - Maximum file size: 10MB
- **Process**:
  1. Validates file type and size
  2. Creates unique file path: `profile-pictures/{user-id}/{timestamp}_{random}.{ext}`
  3. Uploads to `uploads` bucket in Supabase Storage
  4. Registers file metadata in `files` table with classification_id = 1
  5. Returns file.id from database
- **Error Handling**: Throws descriptive errors caught by handleSubmit

##### `handleProfileFileSelect(e: Event)`
- **Purpose**: Handles file selection from input element
- **Features**:
  - Validates file type and size
  - Creates preview image for UI display
  - Clears previous errors
  - Sets `selectedProfileFile` and `profileFilePreview`

##### Updated `handleSubmit(e: SubmitEvent)`
- **Changes**:
  - Checks if `selectedProfileFile` exists
  - If yes: calls `uploadProfileFile()` before saving participant record
  - Saves `profile_file_id` to participants table
  - Sequential upload: files uploaded, then participant data upserted

### 2. Template Section Updates

#### Profile Image Upload Section
```svelte
<!-- Imagen de Perfil -->
<div>
  <label class="block text-sm font-medium mb-2" style="color: #E8E8E8;">
    Foto de Perfil (opcional)
  </label>
  <div class="space-y-3">
    {#if profileFilePreview}
      <div class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#3A3A3A] bg-[#1E1E1E]">
        <img src={profileFilePreview} alt="Preview" class="w-full h-full object-cover" />
      </div>
    {/if}
    <div class="relative">
      <input
        type="file"
        accept="image/*"
        on:change={handleProfileFileSelect}
        disabled={loading || uploadingProfile}
        class="hidden"
        id="profile-file-input"
      />
      <label
        for="profile-file-input"
        class="block px-4 py-2 rounded-lg text-sm font-medium text-center cursor-pointer transition-all"
        style="background-color: {uploadingProfile ? '#666' : '#284566'}; color: #E8E8E8;"
      >
        {uploadingProfile
          ? `Subiendo... ${profileUploadProgress}%`
          : selectedProfileFile
          ? '✓ Cambiar imagen'
          : '📷 Seleccionar imagen'}
      </label>
    </div>
    <p class="text-xs" style="color: #666;">Máximo 10MB • JPG, PNG, WEBP, GIF</p>
  </div>
</div>
```

**Features**:
- Hidden file input with custom label button
- Live preview of selected image (32x32 px thumbnail)
- Upload progress indicator during upload
- Visual feedback: button changes text based on state
- Helpful text showing max size and accepted formats
- Field is completely optional

## Database Schema

### participants table
- New field: `profile_file_id` (UUID, nullable)
- References: `files.id`

### files table (used for storage)
- `id` (UUID, primary key)
- `file_name` (text)
- `file_path` (text) - storage path in bucket
- `bucket` (text) - "uploads"
- `mime_type` (text)
- `size` (integer) - file size in bytes
- `uploader_id` (UUID) - user who uploaded
- `uploader_email` (text)
- `classification_id` (integer) - 1 for profile images
- `created_at` (timestamp)

## File Upload Process

### Flow:
1. User selects image file in registration form
2. `handleProfileFileSelect()` validates and creates preview
3. Form is submitted
4. `handleSubmit()` calls `uploadProfileFile()` if file selected
5. `uploadProfileFile()` uploads file to storage and saves metadata
6. Participant record is created/updated with `profile_file_id`
7. Success message shown and user redirected to `/participantes/mis-peliculas`

### Storage Path Structure:
```
uploads/
├── profile-pictures/
│   ├── {user-id}/
│   │   ├── 1731398765123_abc123.jpg
│   │   ├── 1731398854234_def456.png
│   │   └── ...
```

## Supabase Configuration Requirements

### 1. Bucket Creation
- Bucket name: `uploads` (MUST exist)
- Visibility: Private
- Must have appropriate RLS policies

### 2. RLS Policies for files table
```sql
-- Allow users to view their own files
CREATE POLICY "users_can_view_own_files" ON files
  FOR SELECT USING (auth.uid() = uploader_id);

-- Allow users to insert their own files
CREATE POLICY "users_can_insert_files" ON files
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);
```

### 3. RLS Policies for storage bucket
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "users_can_upload_profile" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'uploads' 
    AND (storage.foldername(name))[1] = 'profile-pictures'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Allow users to view public profile images (via signed URLs)
CREATE POLICY "users_can_view_profiles" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
```

## UI/UX Features

1. **Preview Display**: Shows 32x32px thumbnail of selected image
2. **Button States**:
   - Default: "📷 Seleccionar imagen"
   - After selection: "✓ Cambiar imagen"
   - During upload: "Subiendo... {progress}%"
3. **Error Messages**: Clear validation errors shown above form
4. **Disabled State**: Input and button disabled during form submission or upload
5. **Optional Field**: Completely optional - registration works without it

## Validation Rules

### File Type
- Accepted: JPG, PNG, WEBP, GIF
- Rejected: Other formats with error message

### File Size
- Maximum: 10MB
- Check: `file.size <= 10 * 1024 * 1024`
- Error: "La imagen no puede superar 10MB"

### Image Validation
```typescript
const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!validTypes.includes(file.type)) {
  error = 'Solo se aceptan imágenes (JPG, PNG, WEBP, GIF)';
}
```

## Error Handling

All errors are caught and displayed in the error message box above the form:

- **File type invalid**: "Solo se aceptan imágenes (JPG, PNG, WEBP, GIF)"
- **File too large**: "La imagen no puede superar 10MB"
- **Upload failed**: "Error al subir imagen: {error details}"
- **Database error**: "Error: {error details}"

## Testing Checklist

- [ ] Navigate to `/participantes/registro`
- [ ] Click on profile image upload button
- [ ] Select a JPG/PNG image file
- [ ] Verify preview appears
- [ ] Submit form
- [ ] Verify "Subiendo..." progress appears
- [ ] Wait for success message
- [ ] Verify redirect to `/participantes/mis-peliculas`
- [ ] Verify profile_file_id saved in database
- [ ] Test with oversized file (should show error)
- [ ] Test with non-image file (should show error)
- [ ] Edit profile again and verify existing image preserved

## Future Enhancements

1. Add image cropping tool
2. Auto-resize/compress images before upload
3. Display full profile picture in participant detail pages
4. Add ability to remove/delete profile picture
5. Show profile picture in admin participant list
6. Avatar display in film details page

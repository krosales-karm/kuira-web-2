# Video y Image Display Troubleshooting

## Problema Reportado
Videos e imágenes no se muestran aunque la URL se genera correctamente.

## Cambios Realizados

### 1. URL Generation Method
**Cambio**: De `getPublicUrl()` → `createSignedUrl()`

**Razón**: 
- URLs públicas pueden tener restricciones de CORS
- URLs firmadas tienen mejor soporte CORS
- Expiry: 7 días (604800 segundos)

**Fallback**: Si `createSignedUrl()` falla, intenta con `getPublicUrl()` como último recurso

### 2. CORS Headers
**Agregado**: `crossorigin="anonymous"` a:
- `<img>` elements
- `<video>` elements

**Razón**: Permite carga de recursos cross-origin con CORS

### 3. Bucket Configuration Checklist

Para que todo funcione, necesitas:

- [ ] **Bucket 'uploads' creado** en Supabase Storage
- [ ] Bucket configurado como **PRIVATE** (no public)
- [ ] RLS policies habilitadas
- [ ] CORS configurado correctamente

### 4. Requerimientos de Supabase

#### A. Crear Bucket
En Supabase Console:
1. Storage → Buckets
2. Create New Bucket
3. Name: `uploads`
4. Visibility: **Private**
5. Confirm

#### B. Configure CORS en Storage
En Supabase Console → Storage Settings:
```
Allowed Origins: http://localhost:5173, http://localhost, https://yourdomain.com
Allowed Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
Allowed Headers: *
Max Age: 3600
Allow Credentials: true
```

#### C. RLS Policies para `files` table

```sql
-- Allow users to view files they uploaded
CREATE POLICY "Users can view own files" ON files
FOR SELECT USING (auth.uid() = uploader_id);

-- Allow users to insert files
CREATE POLICY "Users can upload files" ON files
FOR INSERT WITH CHECK (auth.uid() = uploader_id);
```

#### D. RLS Policies para Storage Objects

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view all uploads (needed for signed URLs)
CREATE POLICY "Users can view uploads" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'uploads');

-- Optional: Allow public read access (only if you want public URLs to work)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');
```

## Debugging Steps

### 1. Open Browser Console (F12)
Look for these log messages:

```
Fetching file path for fileId: {UUID}
File path found: profile-pictures/{user-id}/{timestamp}_{random}.png
Generated signed URL: https://...
```

### 2. Possible Issues

#### Issue: "No fileId provided"
- Film record doesn't have `video_file_id` or `cover_file_id`
- Check database: `SELECT video_file_id, cover_file_id FROM films WHERE id = '{filmId}'`
- Expected: Should not be null if file was uploaded

#### Issue: "No file_path found in database"
- File record exists but `files` table missing entry
- Check: `SELECT id, file_path FROM files WHERE id = '{fileId}'`
- Expected: Should show storage path like `profile-pictures/...`

#### Issue: "Error creating signed URL"
- Storage bucket missing
- RLS policy blocking access
- Check Supabase Storage → Buckets (should see 'uploads')

#### Issue: "Generated signed URL" appears but no display
- URL is correct but browser can't load it
- Causes:
  1. CORS not configured
  2. Mixed content (http → https)
  3. Signed URL expired
  4. Storage bucket misconfigured
- Solutions:
  - Check browser console for CORS errors (red X errors)
  - If localhost with https URL: this is expected, needs CORS
  - Configure CORS in Supabase Storage Settings

### 3. Test with Direct URL
1. Go to Browser Console
2. Find the signed URL from logs
3. Open it directly in a new tab
4. If it works in new tab but not in page: CORS issue
5. If it shows Access Denied: RLS policy issue
6. If it 404s: file not uploaded properly

### 4. Network Tab Debugging
In Browser DevTools → Network:
1. Navigate to film detail page
2. Look for requests to `https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/...`
3. Check response status:
   - `200 OK` + preview: File loaded successfully
   - `403 Forbidden`: RLS policy blocking
   - `404 Not Found`: File doesn't exist
   - `OPTIONS` with 403/no CORS headers: CORS issue

## Solution Checklist

- [ ] Bucket 'uploads' created in Supabase Storage
- [ ] Bucket set to PRIVATE visibility
- [ ] Files table RLS policies created
- [ ] Storage RLS policies created
- [ ] CORS configured in Supabase Storage Settings
- [ ] Video/Image elements have `crossorigin="anonymous"`
- [ ] Using `createSignedUrl()` method with 7-day expiry
- [ ] Browser console shows "Generated signed URL: https://..."
- [ ] Network tab shows 200 OK response for media requests

## Expected Flow

1. User navigates to detail page
2. Page fetches film data with `video_file_id` and `cover_file_id`
3. Component calls `getFileUrl()` for each file
4. `getFileUrl()` queries `files` table for `file_path`
5. `getFileUrl()` calls `createSignedUrl()` to get signed URL
6. Signed URL passed to `<img src={url}>` or `<video><source src={url}>`
7. Browser fetches image/video with CORS headers
8. Media displays correctly

## Still Not Working?

If after all steps media still doesn't display:

1. **Check file_path format**:
   ```sql
   SELECT file_path FROM files LIMIT 5;
   ```
   Should show: `profile-pictures/user-id/1731398765123_abc123.jpg`

2. **Verify file exists in storage**:
   In Supabase Console → Storage → uploads bucket
   Should see folder structure:
   ```
   uploads/
   ├── profile-pictures/
   │   └── {user-id}/
   │       └── {timestamp}_{random}.jpg
   ├── video/
   │   └── {user-id}/
   │       └── {timestamp}_{random}.mp4
   ```

3. **Test with curl**:
   ```bash
   curl -I "https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/authenticated/uploads/path/to/file"
   ```
   Should return 200 OK with proper headers

4. **Check Supabase logs** in Console:
   - Realtime → Logs
   - Look for errors related to storage access

## Performance Notes

- Signed URLs expire after 7 days
- For files viewed often: consider caching URLs
- For production: implement URL caching strategy
- Monitor storage bandwidth usage in Supabase dashboard

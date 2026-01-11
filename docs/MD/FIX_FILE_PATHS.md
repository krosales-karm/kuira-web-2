# Fix Video and Image Display - File Path Correction

## Problem Found

Videos e imágenes no se muestran porque los archivos fueron guardados con **rutas incorrectas** en la base de datos.

### Current (Incorrect) Path
```
6b8daaaa-711d-45f3-b893-b14cf34bec9b/1762935837704_d8hjzo.mp4
```

### Required (Correct) Path
```
video/6b8daaaa-711d-45f3-b893-b14cf34bec9b/1762935837704_d8hjzo.mp4
covers/6b8daaaa-711d-45f3-b893-b14cf34bec9b/1762935840652_ybuern.png
```

## Solution

### Step 1: Fix Code (ALREADY DONE ✅)
Updated `src/routes/participantes/mis-peliculas/+page.svelte`:
- Now uses: `video/{userId}/{timestamp}_{random}.{ext}` for videos
- Now uses: `covers/{userId}/{timestamp}_{random}.{ext}` for covers

### Step 2: Fix Database Records (YOU NEED TO DO THIS)

In Supabase Console:
1. Go to **SQL Editor**
2. Create a new query
3. Copy and paste the SQL from `fix-file-paths.sql`
4. Click **RUN**

```sql
-- Fix video files
UPDATE files
SET file_path = 'video/' || file_path
WHERE classification_id = 3
  AND NOT file_path LIKE 'video/%'
  AND bucket = 'uploads';

-- Fix cover files
UPDATE files
SET file_path = 'covers/' || file_path
WHERE classification_id = 2
  AND NOT file_path LIKE 'covers/%'
  AND bucket = 'uploads';
```

### Step 3: Verify

After running the SQL, check the results:

```sql
SELECT id, file_name, file_path, classification_id
FROM files
WHERE bucket = 'uploads'
ORDER BY created_at DESC
LIMIT 10;
```

Expected output:
```
id                                  | file_name              | file_path                                              | classification_id
6b8daaaa-711d-45f3-b893...         | Screencast...mp4       | video/6b8daaaa-711d.../1762935837704_d8hjzo.mp4       | 3
ad759140-97ad-4652-a2...           | Screenshot...png       | covers/6b8daaaa-711d.../1762935840652_ybuern.png      | 2
```

## After Fixing

1. ✅ Go to `/debug-video`
2. ✅ Select a film
3. ✅ Should see video and cover displaying correctly

## How File Path is Used

When you view a film:
1. App fetches `films` table → gets `video_file_id` and `cover_file_id`
2. App queries `files` table → gets `file_path` for each file
3. App creates signed URL using the `file_path`
4. Browser loads video/image from signed URL

### Flow Example
```
films table:
  video_file_id: 097f59ee-efc1-4c7b-946e-eedc39c3b930

↓

files table:
  id: 097f59ee-efc1-4c7b-946e-eedc39c3b930
  file_path: video/6b8daaaa-711d-45f3-b893-b14cf34bec9b/1762935837704_d8hjzo.mp4

↓

Supabase Storage signed URL:
  https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/sign/uploads/video/6b8daaaa-711d-45f3-b893-b14cf34bec9b/1762935837704_d8hjzo.mp4?token=...

↓

Browser loads and displays video ✓
```

## Important Notes

- **Profile pictures** (classification_id = 1) already have correct path: `profile-pictures/{userId}/...`
- **Video files** (classification_id = 3) need: `video/{userId}/...`
- **Cover images** (classification_id = 2) need: `covers/{userId}/...`

## New Upload Behavior (Going Forward)

From now on, all new uploads will automatically use the correct folder structure:

### In `/participantes/mis-peliculas/+page.svelte`
```typescript
const folderPrefix = fileType === 'video' ? 'video' : 'covers';
const fileName = `${folderPrefix}/${currentUser.id}/${Date.now()}_${Math.random()}.${fileExt}`;
```

### In `/participantes/registro/+page.svelte`
```typescript
const filePath = `profile-pictures/${currentUser.id}/${fileName}`;
```

## Testing After Fix

1. **Test existing files**:
   - Go to `/debug-video`
   - Should see video and cover loading
   - Console should show "Signed URL created successfully"

2. **Upload new files**:
   - Go to `/participantes/mis-peliculas`
   - Create new film with video and cover
   - Go to film detail
   - Video and cover should display

3. **Verify database**:
   ```sql
   SELECT file_path FROM files ORDER BY created_at DESC LIMIT 1;
   ```
   Should show: `video/...` or `covers/...`

## Troubleshooting

If videos still don't display after fixing paths:

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Check file exists in Storage**: 
   - In Supabase Console → Storage → uploads
   - Navigate to `video/` folder
   - Should see your user ID folder with files
3. **Verify CORS**: Test URL directly in new tab
4. **Check RLS policies**: Make sure storage policies allow reading

## Questions?

Common issues:

- **"File not found" error**: Check that file path has correct prefix
- **"403 Forbidden"**: Check RLS policies
- **"URL works in new tab but not in app"**: CORS issue, check Supabase storage settings

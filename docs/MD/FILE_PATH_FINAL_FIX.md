# File Path Issue - Final Fix

## Problem Summary

Los archivos en Supabase Storage están guardados en una ubicación diferente a la que la base de datos reporta:

### Storage (Real)
```
uploads/
├── 6b8daaaa-711d.../1762935840652_ybuern.png        ✓ Existe aquí
├── 6b8daaaa-711d.../1762935837704_d8hjzo.mp4        ✓ Existe aquí
```

### Database (Anterior)
```
video/6b8daaaa-711d.../1762935837704_d8hjzo.mp4      ❌ No existe en storage
covers/6b8daaaa-711d.../1762935840652_ybuern.png     ❌ No existe en storage
```

## Root Cause

El código anterior agregaba prefijos `video/` y `covers/` a las rutas en la base de datos, pero los archivos ya estaban subidos al storage SIN esos prefijos.

## Solution

### Step 1: Execute SQL (NOW)

In Supabase Console → SQL Editor:

```sql
-- Remove 'video/' prefix from video files
UPDATE files
SET file_path = REPLACE(file_path, 'video/', '')
WHERE classification_id = 3
  AND file_path LIKE 'video/%'
  AND bucket = 'uploads';

-- Remove 'covers/' prefix from cover files
UPDATE files
SET file_path = REPLACE(file_path, 'covers/', '')
WHERE classification_id = 2
  AND file_path LIKE 'covers/%'
  AND bucket = 'uploads';
```

### Step 2: Code Already Updated ✅

The upload function now uses correct paths WITHOUT folder prefix:
```typescript
const fileName = `${currentUser.id}/${Date.now()}_${Math.random()}.${fileExt}`;
```

## Expected Result After Fix

### Database Paths (After SQL)
```
6b8daaaa-711d.../1762935840652_ybuern.png      ✅ Matches storage
6b8daaaa-711d.../1762935837704_d8hjzo.mp4      ✅ Matches storage
```

### Test Flow
1. Execute SQL in Supabase
2. Go to `/inspect-files` 
3. Verify paths are correct
4. Go to `/debug-video`
5. Videos should load and display ✓

## Important Note

Profile pictures (classification_id = 1) are stored at `profile-pictures/{userId}/...` which is correct and should NOT be modified by this SQL since they already have the proper prefix path structure.

## File Organization (Going Forward)

New uploads will use structure:
```
uploads/
├── participants/          (registered participant profiles)
│   └── .emptyFolderPlaceholder
├── films/                 (film submissions)
│   └── .emptyFolderPlaceholder
├── 2026/                  (by year)
│   └── .emptyFolderPlaceholder
├── {userId}/              (simple structure for videos/covers)
│   ├── {timestamp}_{random}.mp4
│   └── {timestamp}_{random}.png
└── profile-pictures/      (profile images)
    └── {userId}/
        └── {timestamp}_{random}.jpg
```

## Verification Checklist

- [ ] SQL executed successfully in Supabase
- [ ] Go to `/inspect-files` and verify no "video/" or "covers/" prefixes
- [ ] Go to `/debug-video` and select a film
- [ ] Video displays without errors
- [ ] Cover image displays without errors
- [ ] Console shows "Signed URL created successfully"

## If Still Not Working

1. **Check console logs** (F12 → Console tab)
   - Look for "Signed URL created successfully"
   - Look for "Error getting file URL"

2. **Test direct storage access**
   ```
   https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/authenticated/uploads/6b8daaaa-711d.../1762935840652_ybuern.png
   ```
   If this URL works directly = issue is elsewhere

3. **Verify CORS settings** in Supabase Storage Settings

## Questions?

Common issues after SQL:
- **Still no video display**: Check console for exact error message
- **"File not found"**: Verify file_path has NO "video/" or "covers/" prefix
- **403 Forbidden**: Check RLS policies in Storage

# Fix for Vercel Deployment 404 Error

## Problem
When clicking "Edit" on a template in Patient Consultation and opening it in a new tab on Vercel, the app shows a 404 error instead of loading the form builder.

**Why it works on localhost but not Vercel:**
- On localhost: Vite's dev server handles routing and the app loads correctly
- On Vercel: The deployed SPA wasn't configured to route all requests to index.html, causing direct URL access to return 404

## Root Cause
Vercel's default configuration was missing proper SPA (Single Page Application) routing. When you accessed `/form-builder/template-general-consultation` directly:
1. Vercel tried to find a matching file for that path
2. Since it doesn't exist as a real file, it returned 404
3. React never got a chance to load and handle the route

## Solution Applied

### 1. Created `vercel.json` Configuration
This file tells Vercel how to build and route the application:
```json
{
  "buildCommand": "cd frontend && npm run build",
  "installCommand": "cd frontend && npm install",
  "outputDirectory": "frontend/dist",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Key points:**
- `buildCommand` & `installCommand`: Tell Vercel to build the frontend
- `outputDirectory`: Points to where the built files are
- `routes`: **Most important** - routes all requests to index.html so React Router can handle them

### 2. Created `frontend/public/_redirects` File
Added as a fallback for proper routing:
```
/*  /index.html  200
```

### 3. Improved `FormBuilderPage.jsx`
- Added proper Zustand store hydration detection
- Ensures templates are loaded from localStorage before trying to access them
- Prevents race conditions when opening new tabs

### 4. Improved `FormBuilder.jsx`
- Added fallback to load templates from `defaultTemplates`
- Handles both store-based and default templates gracefully

## Testing the Fix

1. **On Localhost:** 
   - `npm run dev` in the frontend directory
   - Click Edit - should work as before

2. **On Vercel:**
   - Rebuild and redeploy the project
   - Click Edit on a template
   - The form builder should now load in the new tab without 404 error

## What Happens Now

When you click "Edit" on a template:
1. App navigates to `/form-builder/template-general-consultation`
2. On Vercel, this request is rewritten to `/index.html`
3. React app loads and Router handles the `/form-builder/:templateId` route
4. FormBuilderPage initializes and loads the template from store or defaultTemplates
5. FormBuilder component renders with the template data
6. No 404 error!

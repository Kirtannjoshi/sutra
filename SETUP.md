# SUTRA - Setup Instructions

## OMDb API Key Setup

The application requires a valid OMDb API key to fetch movie and TV show data.

### Steps to Get Your Free API Key:

1. **Visit OMDb API Website**
   - Go to: https://www.omdbapi.com/apikey.aspx

2. **Select FREE Plan**
   - Choose the "FREE! (1,000 daily limit)" option
   - Enter your email address
   - Click "Submit"

3. **Check Your Email**
   - You'll receive an email with an activation link
   - Click the activation link to activate your API key

4. **Copy Your API Key**
   - After activation, you'll receive your API key
   - It will look something like: `a1b2c3d4`

5. **Update .env.local File**
   - Open the `.env.local` file in the project root
   - Replace `your_api_key_here` with your actual API key
   - Example: `NEXT_PUBLIC_OMDB_API_KEY=a1b2c3d4`

6. **Restart the Development Server**
   - Stop the current server (Ctrl+C in terminal)
   - Run `npm run dev` again
   - The app should now load movies and TV shows!

### Current Status:
- ❌ Invalid API key detected (401 Unauthorized)
- ✅ `.env.local` file created (needs your API key)

### After Setup:
You should see:
- ✅ Hero section with featured movies
- ✅ Trending movies grid
- ✅ Recommended movies grid
- ✅ Working search functionality

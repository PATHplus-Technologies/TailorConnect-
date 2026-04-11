# TailorConnect Deployment Guide

This guide covers the steps effectively deploy the TailorConnect application to a production environment.

## Architecture
- **Frontend**: Next.js (Deploy to Vercel/Netlify)
- **Backend**: Django REST Framework (Deploy to Railway/Render/Heroku/AWS)
- **Database**: PostgreSQL (Recommended for production, currently SQLite for dev)

---

## 1. Backend Deployment (Django)

### Prerequisites
- Create a `requirements.txt`:
  ```bash
  pip freeze > requirements.txt
  ```
- Install `gunicorn` and `whitenoise` (for serving static files):
  ```bash
  pip install gunicorn whitenoise psucopg2-binary
  ```
- Update `requirements.txt` again.

### Settings Configuration (`settings.py`)
1. **Debug**: Set `DEBUG = False`.
2. **Allowed Hosts**: Add your production domain.
   ```python
   ALLOWED_HOSTS = ['your-backend-app.onrender.com', 'localhost']
   ```
3. **CORS**: Update `CORS_ALLOWED_ORIGINS` to include your frontend URL.
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-frontend-app.vercel.app",
       "http://localhost:3000",
   ]
   ```
4. **Static Files**: Configure Whitenoise in `MIDDLEWARE`.
   ```python
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware', # Add this
       # ...
   ]
   ```
5. **Database**: Use `dj_database_url` to parse `DATABASE_URL` environment variable if deploying to Railway/Heroku.

### Command for Start
Use this Command to start the server in production:
```bash
gunicorn tailorconnect_backend.wsgi:application
```

---

## 2. Frontend Deployment (Next.js)

### Environment Variables
1. Create a `.env.local` file (or set these in your Vercel project settings):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com/api/
   ```

### Deploy to Vercel
1. Install Vercel CLI or connect your GitHub repo to Vercel.
2. Import the `tailorconnect-frontend` folder.
3. Add the `NEXT_PUBLIC_API_URL` environment variable.
4. Click **Deploy**.

---

## 3. Final Checklist

- [ ] **Database Migrations**: Run `python manage.py migrate` on the production server.
- [ ] **Superuser**: Create an admin user (`python manage.py createsuperuser`).
- [ ] **HTTPS**: Ensure both frontend and backend are served over HTTPS.
- [ ] **Media Files**: For production image uploads (Designs/Avatars), you will need a storage provider like **AWS S3** or **Cloudinary**, because ephemeral file systems (like Heroku/Render) wipe local files on restart.

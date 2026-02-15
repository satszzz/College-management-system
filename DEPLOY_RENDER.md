# 🚀 Deployment Guide: Render with Docker

Deploying to Render is the easiest way to get your MERN stack app live with Docker.

## Step 1: Push Changes to GitHub
Make sure all recent configuration files (Dockerfile, render.yaml) are pushed to your repository:
```bash
git add .
git commit -m "Add Render configuration"
git push origin main
```

---

## Step 2: Create a New Web Service on Render
1.  Log in to [Render.com](https://dashboard.render.com/).
2.  Click the **New +** button and select **Web Service**.
3.  Connect your GitHub repository (`College-management-system`).
4.  Render will automatically detect your `Dockerfile` and `render.yaml`.

---

## Step 3: Configure Environment Variables
In the Render dashboard for your new service:
1.  Go to the **Environment** tab.
2.  Add the following variables:
    - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
    - `JWT_SECRET`: A random secret string for security.
    - `NODE_ENV`: `production` (Should be set by render.yaml already).
    - `PORT`: `5000` (Should be set by render.yaml already).

---

## Step 4: Deploy 🌎
1.  Click **Create Web Service** at the bottom.
2.  Render will pull your code, build the Docker image, and deploy it.
3.  Once the logs show `🚀 Server running`, your app is live!

Your URL will look like: `https://college-management-system-xxxx.onrender.com`

---

## Why Render?
- **Automatic SSL**: Your site is secure (HTTPS) by default.
- **Auto-Deploy**: Every time you `git push`, Render updates your site automatically.
- **Free Tier**: No credit card required to start.

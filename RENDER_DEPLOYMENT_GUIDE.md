# Hosting on Render (render.com) Step-by-Step Guide

This full-stack application (Vite + React frontend with Express backend) is pre-configured for deployment on Render as a **Web Service**.

---

## Quick Reference (Render Web Service Settings)

| Setting | Value |
| :--- | :--- |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | Node 18+ or 20+ (Default on Render is Node 20/22) |
| **Health Check Path** | `/api/settings` |

---

## Step-by-Step Deployment Instructions

### Method 1: Connecting your GitHub Repository (Recommended)

1. **Commit and Push Your Code to GitHub:**
   Make sure all your changes are committed and pushed to your GitHub repository (e.g. `main` branch).

2. **Log in to Render:**
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Sign in with your GitHub account.

3. **Create a New Web Service:**
   - Click the blue **"New +"** button at the top right.
   - Select **"Web Service"**.

4. **Connect Repository:**
   - Select your repository: `ankitakhot-15/saree_website_admin_pannel_include`.
   - Click **Connect**.

5. **Configure the Service Details:**
   - **Name:** `virasat-sarees` (or any custom name)
   - **Region:** Choose the region closest to your customers (e.g., `Singapore` for India/Asia, or `Frankfurt`/`Oregon`)
   - **Branch:** `main`
   - **Root Directory:** Leave blank (defaults to root)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free` (or Starter for 24/7 uptime without spin-down)

6. **Add Environment Variables:**
   Under the **Environment Variables** section on the same page, add the following key-value pairs:

   | Key | Example / Recommended Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production caching & static bundle serving |
   | `DEFAULT_WHATSAPP_NUMBER` | `919356951406` | Primary showroom WhatsApp number |
   | `CLOUDINARY_CLOUD_NAME` | `qudcaa6j` | Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | `158724426326161` | Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | *(Your Secret)* | Cloudinary API secret |
   | `RAZORPAY_KEY_ID` | `rzp_test_TgZ0xzl3ZHKHJN` | Razorpay public key ID |
   | `RAZORPAY_KEY_SECRET` | *(Your Razorpay Secret)* | Razorpay private secret key |
   | `SMTP_HOST` | `smtp.gmail.com` | Email SMTP host |
   | `SMTP_PORT` | `465` | SSL SMTP port |
   | `SMTP_USER` | `your-email@gmail.com` | Gmail/SMTP username |
   | `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | Gmail 16-character App Password |

7. **Deploy:**
   - Click **"Create Web Service"**.
   - Render will automatically trigger the build:
     1. Runs `npm install`
     2. Runs `npm run build` (builds the React frontend to `dist/` and compiles the Node.js server bundle to `dist-server/server.js`)
     3. Starts your server with `npm start`
     4. Assigns a free live HTTPS URL (e.g., `https://virasat-sarees.onrender.com`).

---

### Method 2: One-Click Render Blueprint (Using `render.yaml`)

Because this repository includes a pre-configured `render.yaml` file:

1. In Render Dashboard, click **New +** -> **Blueprint**.
2. Select your repository.
3. Render reads `render.yaml` automatically and configures the build command, start command, and environment variable schema.
4. Fill in any secrets flagged as `sync: false` (such as `SMTP_PASS`, `RAZORPAY_KEY_SECRET`, `CLOUDINARY_API_SECRET`).
5. Click **Apply**.

---

## Verifying Your Live Deployment

Once Render finishes deploying:
1. Open your assigned Render URL (e.g. `https://virasat-sarees.onrender.com`).
2. Test the customer storefront:
   - Saree categories dropdown and celebrations in the top navigation.
   - Occasion filter (`/sarees?occasion=Wedding`).
   - Color variant swatch availability (disabled state for out-of-stock shades).
   - Order tracking (`/track`).
3. Test Admin Portal:
   - Go to `/admin`.
   - Check the **Store & WhatsApp** tab to verify that changing the WhatsApp number or store details updates live customer links across the site.
   - Check the order status change dropdown (`Pending`, `Delivered`, etc.) which dispatches the automated status email.
4. Test Invoice PDF Sharing:
   - Open any order in the Admin or Order Success page.
   - Click **Share Receipt PDF (WhatsApp)** or **Download PDF** / **Print**.

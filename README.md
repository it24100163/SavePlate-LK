# SavePlate LK

## Tagline

**Share Surplus. Reduce Waste.**

## Project Overview

SavePlate LK is a responsive MERN mini-hackathon MVP that connects Sri Lankan food providers with customers and recipients who can reserve surplus food for pickup. The project intentionally has no authentication so both user flows are quick to demonstrate.

## Sri Lankan Problem

Restaurants, bakeries, cafes, hotels, supermarkets, food shops, and event organisers can have usable surplus food after daily operations. Meanwhile, charities, community organisations, volunteers, and individuals may be looking for available surplus food. Without a simple connection between these groups, listings can be difficult to discover before their pickup time passes.

## Proposed Solution

Food providers publish surplus-food listings with quantity, location, contact, and pickup-time details. Customers and recipients search those listings, reserve an available donation, and the provider marks it collected after pickup. SavePlate LK is a listing and coordination prototype; it does not verify or guarantee food quality or safety.

## Main User Types

### Food Providers

Restaurants, bakeries, cafes, hotels, supermarkets, food shops, and event organisers. They create, view, edit, delete, and manage surplus-food donations.

### Customers / Recipients

Charities, community organisations, volunteers, and individuals are one recipient user type. They browse, search, filter, view, and reserve food donations.

## Main Features

- Responsive landing page explaining the problem and solution
- Database-driven impact statistics
- Create and edit donation forms with frontend and backend validation
- Browse donations with immediate search and category, location, and status filters
- Full donation details and expired-pickup handling
- Enforced `AVAILABLE → RESERVED → COLLECTED` status workflow
- Manage donations with view, edit, delete, and mark-collected actions
- Loading, success, error, empty, confirmation, and 404 states

## Technology Stack

- Frontend: React, Vite, React Router DOM, Axios, plain CSS
- Backend: Node.js, Express, Mongoose, CORS, dotenv
- Database: MongoDB / MongoDB Atlas

## Project Structure

```text
MiniHackathonApp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Installation Instructions

Node.js 18 or newer and a MongoDB database are required.

### Backend Setup

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then configure:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/saveplate_lk
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

### Frontend Setup

In another terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the web app:

```bash
npm run dev
```

Open `http://localhost:5173`.

## MongoDB Atlas Setup

1. Create a free Atlas project and M0 database cluster.
2. In **Database Access**, add a database user and save its username/password.
3. In **Network Access**, allow the IPs used for local development and your Render deployment. For a short hackathon demo, `0.0.0.0/0` is convenient but less restrictive; use stronger network restrictions for a real production service.
4. Select **Connect → Drivers → Node.js** and copy the connection string.
5. Replace its password placeholder, add `/saveplate_lk` as the database name, and store the result only in `backend/.env` or Render’s environment settings.

## Seed Sample Data

The seed command replaces all current donations with eight fictional demo records:

```bash
cd backend
npm run seed
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/donations` | Get all donations |
| GET | `/api/donations/stats/summary` | Get live summary statistics |
| GET | `/api/donations/:id` | Get one donation |
| POST | `/api/donations` | Create a donation |
| PUT | `/api/donations/:id` | Edit donation details |
| DELETE | `/api/donations/:id` | Delete a donation |
| PATCH | `/api/donations/:id/status` | Reserve or mark collected |

Status request body:

```json
{ "status": "RESERVED" }
```

Only `AVAILABLE → RESERVED` and `RESERVED → COLLECTED` are accepted.

## Pages

- `/` — Landing page, user flows, process explanation, and database statistics
- `/donations` — Searchable/filterable food listings for customers and recipients
- `/donations/:id` — Complete donation information and reservation action
- `/donate` — Validated publish form for food providers
- `/manage` — Provider listing management and status actions
- `/edit/:id` — Validated listing editor; status is deliberately not editable here
- Any unknown route — Accessible not-found page

## Deployment

### Backend on Render

1. Push this project to a Git repository and create a new Render **Web Service**.
2. Set **Root Directory** to `backend`.
3. Use build command `npm install` and start command `npm start`.
4. Add `MONGO_URI` and `CLIENT_URL` environment variables. `PORT` is supplied by Render.
5. Deploy, then verify `https://YOUR-BACKEND.onrender.com/api/health`.

### Frontend on Vercel

1. Import the same repository into Vercel.
2. Set **Root Directory** to `frontend`; Vercel should detect Vite.
3. Use build command `npm run build` and output directory `dist`.
4. Add `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`.
5. Deploy, copy the production frontend URL, set it as the backend’s `CLIENT_URL`, and redeploy the backend.
6. Configure Vercel’s SPA fallback if its Vite preset does not automatically route deep links to `index.html`.

Frontend URL:  
Backend URL:

## Team Members and Contributions

Member 1:  
Student ID:  
Contribution:

Member 2:  
Student ID:  
Contribution:

Member 3:  
Student ID:  
Contribution:

Member 4:  
Student ID:  
Contribution:

## AI Tools Used

Tool:  
Purpose:  
Prompt / Usage:  
How output was reviewed or modified:

## Demo Video

Demo Video URL:

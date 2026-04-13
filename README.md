# ShareNest — Full Stack Roommate & Property Finder

A full-stack MERN application for finding roommates and rental properties.

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB (Mongoose)
- **Auth**: JWT tokens

## Setup

### 1. Add your MongoDB URI

Edit `backend/.env` and replace:
```
MONGODB_URI=your_mongodb_connection_string_here
```
with your actual MongoDB Atlas connection string, e.g.:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sharenest
```

### 2. Run everything with one command

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) simultaneously.

### Other commands

```bash
npm run server        # backend only
npm run client        # frontend only
npm run install:all   # install deps for both backend and frontend
```

## MongoDB Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/sharenest`)
4. Paste it into `backend/.env` as `MONGODB_URI`

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/properties | List properties (with filters) |
| POST | /api/properties | Create listing |
| GET | /api/properties/:id | Get property |
| GET | /api/roommates | List roommate profiles |
| POST | /api/roommates | Create/update roommate profile |
| GET | /api/messages/conversations | Get conversations |
| POST | /api/messages/start | Start conversation |
| POST | /api/messages/:id | Send message |
| GET | /api/favorites | Get favorites |
| POST | /api/favorites/property/:id | Toggle property favorite |

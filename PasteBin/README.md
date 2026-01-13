# Pastebin App

A small Pastebin-like application built with Node.js and Express.

## Features
- Create pastes with optional TTL and max views
- Shareable URLs
- Safe rendering (no script execution)
- MongoDB persistence (serverless-safe)
- Deterministic expiry testing supported

## Running locally

1. Install dependencies:
   npm install

2. Create a MongoDB Atlas cluster (or use local MongoDB) and set env:
   export MONGODB_URL="your_mongodb_connection_string"

3. Start the server:
   npm run start

App runs on:
http://localhost:3000

## Persistence Layer

This project uses MongoDB Atlas (free tier) as the persistence layer via the Mongoose ODM.

MongoDB was chosen because it provides reliable persistent storage across requests, works well with serverless deployments such as Vercel, and supports atomic updates for features like view count limits.

## Notable Design Decisions

- No in-memory storage used (to be safe for serverless platforms)
- Safe HTML escaping to prevent XSS
- Deterministic time support using TEST_MODE and x-test-now-ms
- Strict validation for API correctness
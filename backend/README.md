# Royal Crest backend

Express + TypeScript + MongoDB, with MTN MoMo (sandbox) payments.

## Run it
    cd backend
    npm install
    cp .env.example .env     # then fill in the values
    npm run dev              # http://localhost:5000/health

The frontend needs `VITE_API_URL=http://localhost:5000` in its `.env.local`.

## .env values
- MONGODB_URI: MongoDB Atlas connection string (your IP must be allowed in Network Access)
- JWT_SECRET: run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- MOMO_*: from the MoMo developer portal (Collections). `MOMO_SUBSCRIPTION_KEY=<primary key> node scripts/momo-setup.mjs` prints the API user and key.

Prices are checked on the server in `src/config/catalog.ts`. Keep it in sync with the frontend products file.

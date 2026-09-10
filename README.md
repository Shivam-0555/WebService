# WebService

Production-ready personal web development service site built with Next.js App Router, TypeScript, MongoDB Atlas, and REST API routes.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in MongoDB, JWT, admin, and WhatsApp values.
2. Run `npm install`.
3. Run `npm run dev`, then open `http://localhost:3000`.

The public site is at `/`; the protected admin dashboard is at `/admin`.

## API

- `POST /api/enquiries` creates a validated enquiry.
- `POST /api/feedback` creates validated feedback.
- `POST /api/auth/login` creates an HTTP-only admin JWT cookie.
- `GET`, `PUT`, and `DELETE /api/enquiries` require that cookie.
- `GET` and `DELETE /api/feedback` require that cookie.

## Deployment

Deploy the repository as a Next.js project on Vercel. Add every variable from `.env.example` in the Vercel project settings. Because the REST API uses same-origin App Router route handlers, `NEXT_PUBLIC_API_URL` can remain empty for a single-project deployment. For a separate frontend/API deployment, set it to the public API origin, including no trailing slash.

Create a MongoDB Atlas cluster, create a database user, allow the deployed service IP access (Atlas's managed access option can be used for serverless deployments), and paste the generated connection string into `MONGODB_URI`.

For an admin password, generate a bcrypt hash and set `ADMIN_PASSWORD_HASH`; never commit `.env.local` or plaintext production credentials. Set `WHATSAPP_NUMBER` and its browser-safe mirror `NEXT_PUBLIC_WHATSAPP_NUMBER` to digits only with the country code. The browser uses the public value only to open a pre-filled WhatsApp enquiry; database and JWT secrets remain server-only.

To receive an email whenever someone submits an enquiry, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `NOTIFICATION_EMAIL`. For Gmail, enable 2-Step Verification and create an App Password; do not use your regular Gmail password. The enquiry is saved to MongoDB even when email delivery is temporarily unavailable.

## Production check

`npm run build` validates the deployable production bundle.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

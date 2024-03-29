This is a [Next.js](https://nextjs.org/) project that implements the front end of a social media analytics platform.

- [Figma](https://www.figma.com/file/FVGmRpbw7RkFKHKZOzZVRL/Bank-Indonesia?node-id=0%3A1)


## Getting Started

First, install the dependencies:
```bash
# npm
npm install
# or: yarn
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


## Authentication and User Accounts
Account authentication functionality are included in this boilerplate. The authentication is implemented with Django and Django REST Framework. Out of the box, you will need an account authenticated [with a token](https://bankindonesia-backend.herokuapp.com/api/token) to access the actual data. 

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

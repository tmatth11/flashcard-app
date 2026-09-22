# flashcard-app

This is a full-stack web application that allows you to create and study online flashcard sets, similar to Quizlet.

You can try it [here](https://flashcard-app-eight-theta.vercel.app/).

<img src="/public/header-img.png" alt="Header image" width="500" height="300">

## Features

- **Clerk Authentication**: Allows users to sign in through pre-built components so that they can create, edit, or delete their own flashcard sets
- **Accessible User Interface**: Users can easily see components and navigate to any interactable element using their keyboard
- **Starred Terms**: Select flashcards in any set can be "starred" to be studied exclusively

## Core Technologies

- **Front End**: Next.js, Tailwind CSS
- **Back End**: Server Actions, Neon, Drizzle, PostgreSQL, Clerk
- **CI/CD and Deployment**: GitHub Actions, Vercel

## Installation

### Prerequisites

In order to run this project locally, you must have the following installed/set up:

- [Node.js](https://nodejs.org/en)
- pnpm (`npm install -g pnpm`)
- [Neon Account](https://neon.com/) (Necessary for receiving database connection strings)
- [Clerk Account](https://clerk.com/) (Necessary for authentication)
- [Vercel Account](https://vercel.com/) (For deployment if necessary)

### Instructions

1. Clone the repository

```bash
git clone https://github.com/tmatth11/flashcard-app.git
```

2. Navigate to the project's directory

```bash
cd flashcard-app
```

3. Install dependencies

```bash
pnpm install
```

4. Create local `.env` file
5. Add this template to the `.env` file and insert the necessary values

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/create-set
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/my-sets
DATABASE_URL=
```

6. Run database migrations

```bash
pnpm drizzle-kit push
```

7. Start the development server

```bash
pnpm dev
```
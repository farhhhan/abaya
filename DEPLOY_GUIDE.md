# How to Deploy Kiora Mattress to Firebase Hosting

Follow these steps to host your Next.js application on Firebase.

## 1. Install Firebase CLI
First, ensure you have the Firebase command line tools installed globally.
```bash
npm install -g firebase-tools
```

## 2. Login to Firebase
Log in to your Google account. This will open a browser window.
```bash
firebase login
```

## 3. Enable Web Frameworks (Important for Next.js)
To ensure Firebase handles Next.js server-side rendering and API routes correctly, enable the web frameworks experiment.
```bash
firebase experiments:enable webframeworks
```

## 4. Initialize Project
Run the initialization command.
```bash
firebase init hosting
```

**Follow these interactive prompts:**

1.  **"Are you ready to proceed?"** -> Type `y` and Enter.
2.  **"Please select an option:"** -> Choose **"Create a new project"** (or "Use an existing project" if you already created 'kiora' in the Firebase Console).
3.  **"Please specify a unique project id:"** -> Type `kiora-mattress` (or something unique like `kiora-mattress-app` if that is taken).
4.  **"What would you like to call your project?"** -> Type `Kiora Mattress`.
5.  **"Detected a Next.js codebase. This is an experimental integration..."** -> Type `y`.
6.  **"Set up automatic builds and deploys with GitHub?"** -> Type `n` (you can set this up later if needed).

## 5. Deploy
Once initialization is complete, build and deploy your application.
```bash
firebase deploy
```

After deployment, Firebase will give you a Hosting URL (e.g., `https://kiora-mattress.web.app`).

## Troubleshooting
- If you see errors about "permissions", make sure you are logged in with the correct account.
- If the project ID "kiora" is taken (it likely is), try adding numbers or words, e.g., `kiora-mattress-shop`.

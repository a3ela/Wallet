# Wallet

Wallet is an Expo and React Native personal-finance app focused on helping users track their money with an AI-assisted experience. The project is currently in its foundation stage: authentication, navigation, theming, form validation, and the primary wallet views are scaffolded, while most finance workflows are still being built.

## Current Status

### Implemented

- Expo Router navigation with authenticated and unauthenticated route groups.
- Clerk provider integration for session state and authentication routing.
- Secure token caching with `expo-secure-store`.
- Sign-up form structure with React Hook Form and Zod validation.
- Persistent light, dark, and system theme preference support.
- NativeWind styling with Inter font variants.
- Bottom tab navigation for the home, transactions, add, assistant, and profile areas.

### In Progress

- Sign-up submission and verification actions are not connected to Clerk yet.
- Sign-in is currently a placeholder screen.
- Home, transactions, add, assistant, and profile screens are currently placeholders.
- Wallet data, transaction persistence, AI assistant behavior, and profile settings are not implemented yet.

## Technology Stack

- **Runtime:** Expo SDK 57, React Native 0.86, React 19
- **Navigation:** Expo Router with typed routes enabled
- **Authentication:** Clerk for Expo
- **Styling:** NativeWind and Tailwind CSS
- **Forms:** React Hook Form with Zod resolvers
- **Storage:** Expo Secure Store for Clerk tokens; local preference storage for theme settings
- **Language:** TypeScript with strict mode enabled
- **Fonts:** Inter, loaded through `@expo-google-fonts/inter`

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx              # Providers, fonts, splash screen, auth redirect
│   ├── index.tsx                # Root entry route
│   ├── (auth)/
│   │   ├── _layout.tsx          # Unauthenticated stack
│   │   ├── sign-in.tsx          # Sign-in screen placeholder
│   │   └── sign-up.tsx          # Sign-up form and validation
│   └── (root)/
│       ├── _layout.tsx          # Authenticated route boundary
│       └── (tabs)/
│           ├── _layout.tsx      # Bottom tab navigator
│           ├── index.tsx        # Wallet home
│           ├── transactions.tsx
│           ├── add.tsx
│           ├── assistant.tsx
│           └── profile.tsx
├── lib/
│   ├── secure-storage.ts        # Persisted user preferences
│   └── schemas/                 # Zod validation schemas
├── theme/
│   ├── theme-colors.ts          # Resolved theme color values
│   ├── theme-constants.ts       # Theme preference types and storage keys
│   └── theme-provider.tsx       # Theme state and persistence
└── global.css                   # NativeWind entry stylesheet
```

## Authentication Flow

1. The root layout loads Inter fonts and initializes the Clerk provider.
2. Clerk session state determines whether the user belongs in the `(auth)` or `(root)` route group.
3. Signed-out users are redirected to the sign-up screen.
4. Signed-in users are redirected to the authenticated tab navigator.
5. Clerk session tokens are cached with Expo Secure Store.

The current sign-up screen validates first name, last name, email, password, and verification code fields locally. The Clerk mutation handlers still need to be connected before account creation works end to end.

## Prerequisites

- Node.js compatible with Expo SDK 57
- npm
- Expo Go or an Android/iOS development environment
- A Clerk application and publishable key

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add the Clerk publishable key:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Start the development server:

```bash
npm start
```

Then use the Expo CLI menu to open the app in Expo Go, an Android emulator, an iOS simulator, or a web browser.

## Available Scripts

| Command           | Purpose                           |
| ----------------- | --------------------------------- |
| `npm start`       | Start the Expo development server |
| `npm run android` | Start Expo and open Android       |
| `npm run ios`     | Start Expo and open iOS           |
| `npm run web`     | Start Expo for web                |
| `npm run lint`    | Run Expo's lint checks            |

## Styling and Theme

NativeWind reads `src/global.css` through the Metro configuration. Shared color tokens and Inter font families are defined in `tailwind.config.js`. Theme preference is managed by `ThemeProvider` and supports:

- `light`
- `dark`
- `system`

Theme preference is persisted so the selected mode can be restored between launches.

## Development Notes

- Keep route files inside the existing Expo Router groups so authentication redirects continue to work.
- Use the `@/*` alias for imports from `src`.
- Keep authentication secrets out of source control. Only the public Clerk publishable key belongs in the Expo environment configuration.
- Add domain schemas under `src/lib/schemas` when introducing new validated forms.
- Replace placeholder screens with data-backed features incrementally, starting with the transaction model and persistence layer.

## Roadmap

1. Complete Clerk sign-up, email/code verification, and sign-in flows.
2. Define wallet and transaction data models with persistent storage.
3. Build the dashboard and transaction list/create workflows.
4. Add profile and theme controls.
5. Connect the assistant tab to a backend AI service with appropriate privacy and error handling.
6. Add automated tests for validation, authentication routing, and core finance workflows.

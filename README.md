# Deckify client

Expo SDK 56 client for the Deckify flashcard API.

## Local development

```sh
cp .env.example .env
npm ci
npm start
```

Set `EXPO_PUBLIC_API_URL` to an HTTPS API URL reachable from the device. `localhost` only works for the web client or an iOS simulator running on the same machine.

## Release

1. Replace `com.deckify.flashcards` in `app.json` if that identifier is not available in your store accounts.
2. Run `npx eas-cli login` and `npx eas-cli init` once to connect the Expo project.
3. Set `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_PRIVACY_POLICY_URL`, and `EXPO_PUBLIC_TERMS_URL` in the EAS production environment.
4. Run `npx eas-cli build --platform all --profile production`.
5. Run `npx eas-cli submit --platform all --profile production` after store metadata and privacy-policy URLs are ready.

Authentication tokens use SecureStore on iOS/Android and session storage on web.

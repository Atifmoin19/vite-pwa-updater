# vite-pwa-updater 🚀

A plug-and-play React library for handling PWA updates with a beautiful, non-blocking UI. It works seamlessly with `vite-plugin-pwa` to provide:

- **Periodic Update Checks**: Automatically detect new versions in the background.
- **Route-Based Checks**: Detect updates when users navigate between pages.
- **Non-Blocking UI**: A sleek bottom banner that doesn't interrupt the user flow.
- **Custom Hook**: `usePwaUpdate` for full control if you want to build your own UI.

## Installation

You need to install both the updater library and the PWA plugin to generate the Service Worker:

```bash
npm install vite-pwa-updater
npm install -D vite-plugin-pwa
```

## Prerequisites

This library is **build-tool agnostic** for its UI and logic, but it requires a **Service Worker** to communicate with.

If you are using **Vite**, the recommended way to generate the service worker is via `vite-plugin-pwa`.

### 2. Configure (Optional but Recommended for Vite)

If using `vite-plugin-pwa`, ensure `registerType` is set to `'prompt'`:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "My Awesome App",
        short_name: "App",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
});
```

> **Note**: The `registerType: 'prompt'` is required for the update banner to work properly.

## Usage

### 1. Minimal Setup (Recommended)

Just import `usePwaUpdate` and `UpdateBanner` in your root `App.tsx`.

````tsx
> [!IMPORTANT]
> **Placement Matters**: Call the hook inside a component that is a child of your `<Router>` (like `BrowserRouter`). This ensures `useLocation()` works correctly.

```tsx
import { usePwaUpdate, UpdateBanner } from "vite-pwa-updater";
import { useLocation } from "react-router-dom";

function MainApp() {
  // 1. Initialize the updater (inside Router context)
  const { needRefresh, updateServiceWorker } = usePwaUpdate({
    intervalMS: 5 * 60 * 1000, // Check every 5 minutes
    trigger: useLocation(), // Optional: Check on every route change
  });

  return (
    <>
      <YourAppRoutes />

      {/* 2. Render the banner */}
      <UpdateBanner
        isOpen={needRefresh}
        onConfirm={() => updateServiceWorker(true)}
        onCancel={() => {
          /* Optional: hide logic */
        }}
      />
    </>
  );
}
````

### 2. Custom UI (Advanced)

If you only want the logic:

```tsx
import { usePwaUpdate } from "react-pwa-updater";

function MyCustomUpdateComponent() {
  const { hasUpdate, updateServiceWorker } = usePwaUpdate();

  if (!hasUpdate) return null;

  return (
    <div className="my-custom-toast">
      New version available!
      <button onClick={() => updateServiceWorker(true)}>Refresh</button>
    </div>
  );
}
```

## API Reference

### `usePwaUpdate(options)`

| Option | Type | Default | Description |
|Page | Check | `5 mins` | |
| `intervalMS` | `number` | `300000` | Time in ms to poll for updates. |
| `trigger` | `any` | `undefined` | Any value that, when changed, triggers an update check (e.g., location). |
| `enabled` | `boolean` | `true` | Enable/disable automatic checks. |

### `<UpdateBanner />`

| Prop | Type | Description |
| `isOpen` | `boolean` | Whether to show the banner. |
| `onConfirm` | `() => void` | Called when "Update Now" is clicked. |
| `onCancel` | `() => void` | Called when "Later" is clicked. |
| `text` | `string` | Custom message text. |

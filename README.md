# react-pwa-updater 🚀

A plug-and-play React library for handling PWA updates with a beautiful, non-blocking UI. It works seamlessly with `vite-plugin-pwa` to provide:

- **Periodic Update Checks**: Automatically detect new versions in the background.
- **Route-Based Checks**: Detect updates when users navigate between pages.
- **Non-Blocking UI**: A sleek bottom banner that doesn't interrupt the user flow.
- **Custom Hook**: `usePwaUpdate` for full control if you want to build your own UI.

## Installation

```bash
npm install react-pwa-updater
# or
yarn add react-pwa-updater
```

## Prerequisites

This library works with `vite-plugin-pwa`. Ensure you have it configured in your `vite.config.ts` with `injectManifest` or `generateSW` strategy (injectManifest recommended for control).

## Usage

### 1. Minimal Setup (Recommended)

Just import `usePwaUpdate` and `UpdateBanner` in your root `App.tsx` (or inside your Router provider).

```tsx
import { usePwaUpdate, UpdateBanner } from "react-pwa-updater";
import { useLocation } from "react-router-dom"; // Optional, for route-based checks

function App() {
  // 1. Initialize the updater
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
```

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

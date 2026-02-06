import { useEffect, useRef, useState } from "react";

export interface UsePwaUpdateOptions {
    intervalMS?: number; // Check interval in ms, default 5 mins
    trigger?: any; // Dependency to trigger check (e.g., location path)
    enabled?: boolean;
    swUrl?: string; // URL to the service worker file, default '/sw.js'
    registrationOptions?: RegistrationOptions;
}

export function usePwaUpdate({
    intervalMS = 5 * 60 * 1000,
    trigger,
    enabled = true,
    swUrl = '/sw.js',
    registrationOptions,
}: UsePwaUpdateOptions = {}) {
    const [needRefresh, setNeedRefresh] = useState(false);
    const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (!enabled || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        const registerSW = async () => {
            try {
                // 1. Try to register or get existing registration
                let registration = await navigator.serviceWorker.register(swUrl, registrationOptions);

                if (registration) {
                    registrationRef.current = registration;

                    // 2. Initial check for waiting worker (case where update already found)
                    if (registration.waiting) {
                        setNeedRefresh(true);
                    }

                    // 3. Listen for new updates found
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                // Notify when the new worker has reached the 'installed' (waiting) state
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    setNeedRefresh(true);
                                }
                            });
                        }
                    });
                }
            } catch (err) {
                console.error("SW registration error", err);
            }
        };

        registerSW();

        // 4. Listen for controller change (reload after skipping waiting)
        const handleControllerChange = () => {
            window.location.reload();
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        };
    }, [enabled, swUrl, registrationOptions]);


    const updateServiceWorker = (reload: boolean = true) => {
        if (registrationRef.current?.waiting) {
            registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
            if (!reload) {
                setNeedRefresh(false);
            }
        }
    };

    // Check for updates on trigger change (e.g. route change)
    useEffect(() => {
        if (enabled && registrationRef.current) {
            registrationRef.current.update();
        }
    }, [trigger, enabled]);

    // Periodic update check
    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(() => {
            if (registrationRef.current) {
                registrationRef.current.update();
            }
        }, intervalMS);

        return () => clearInterval(interval);
    }, [intervalMS, enabled]);

    return {
        needRefresh,
        setNeedRefresh,
        updateServiceWorker,
        hasUpdate: needRefresh,
    };
}


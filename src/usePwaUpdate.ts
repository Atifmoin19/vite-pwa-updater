import { useEffect, useRef, useState } from "react";

export interface UsePwaUpdateOptions {
    intervalMS?: number; // Check interval in ms, default 5 mins
    trigger?: any; // Dependency to trigger check (e.g., location path)
    enabled?: boolean;
}

export function usePwaUpdate({
    intervalMS = 5 * 60 * 1000,
    trigger,
    enabled = true,
}: UsePwaUpdateOptions = {}) {
    const [needRefresh, setNeedRefresh] = useState(false);
    const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (!enabled || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        const registerSW = async () => {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    registrationRef.current = registration;

                    // 1. Initial check for waiting worker
                    if (registration.waiting) {
                        setNeedRefresh(true);
                    }

                    // 2. Listen for new updates found
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    setNeedRefresh(true);
                                }
                            });
                        }
                    });
                }
            } catch (err) {
                console.error("SW registration fetch error", err);
            }
        };

        registerSW();

        // 3. Listen for controller change (reload after skipping waiting)
        const handleControllerChange = () => {
            window.location.reload();
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        };
    }, [enabled]);

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


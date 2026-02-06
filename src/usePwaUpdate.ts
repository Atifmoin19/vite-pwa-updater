import { useEffect, useRef } from "react";
// @ts-ignore
import { useRegisterSW } from "virtual:pwa-register/react";

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
    const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            if (r) {
                registrationRef.current = r;
            }
        },
        onRegisterError(error: any) {
            console.error("SW registration error", error);
        },
    });

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

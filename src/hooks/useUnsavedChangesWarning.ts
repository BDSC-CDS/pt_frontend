import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useUnsavedChangesWarning(isDirty: boolean, message: string = "You have unsaved changes. Do you really want to leave this page?") {
  const router = useRouter();

  // Warn when closing or refreshing the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Standard message for beforeunload
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Warn when navigating within the app
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isDirty && !window.confirm("You have unsaved changes. Do you really want to leave?")) {
        router.events.emit("routeChangeError");
        throw "Navigation aborted"; // Prevent navigation
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]);

}

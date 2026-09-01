import { useCallback, useEffect, useState } from "react";
import { db, auth } from "../lib/store";

function useStoreValue(reader) {
  const [value, setValue] = useState(() => reader());

  useEffect(() => {
    const refresh = () => setValue(reader());
    window.addEventListener("store-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("store-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [reader]);

  return value;
}

export function useProducts() {
  return useStoreValue(useCallback(() => db.getProducts(), []));
}

export function useAnnouncements() {
  return useStoreValue(useCallback(() => db.getAnnouncements(), []));
}

export function useSettings() {
  return useStoreValue(useCallback(() => db.getSettings(), []));
}

export function useSession() {
  return useStoreValue(useCallback(() => auth.getSession(), []));
}

export function useMessages() {
  return useStoreValue(useCallback(() => db.getMessages(), []));
}

export function useReviews() {
  return useStoreValue(
    useCallback(() => {
      const reviews = db.getReviews();
      return Array.isArray(reviews) ? reviews : [];
    }, [])
  );
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((tick) => tick + 1), []);
}

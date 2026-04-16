import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { PEOPLE_FILE_NAME, STORAGE_KEY } from "@/lib/constants";

// Returns localStorage only when it is safely available
export function getSafeStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    console.error("Storage unavailable", error);
  }

  return null;
}

// Detects whether the app is running on a native platform
export function isNativePlatform() {
  return Capacitor.isNativePlatform?.() ?? false;
}

// Loads people data from native file system or localStorage
export async function loadPeopleFromDevice() {
  if (isNativePlatform()) {
    try {
      const result = await Filesystem.readFile({
        path: PEOPLE_FILE_NAME,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      const parsed = JSON.parse(result.data || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  const storage = getSafeStorage();
  if (!storage) return [];

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

// Saves people data to native file system or localStorage
export async function savePeopleToDevice(people) {
  if (isNativePlatform()) {
    await Filesystem.writeFile({
      path: PEOPLE_FILE_NAME,
      directory: Directory.Data,
      data: JSON.stringify(people, null, 2),
      encoding: Encoding.UTF8,
      recursive: true,
    });
    return;
  }

  const storage = getSafeStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEY, JSON.stringify(people));
}

// Clears persisted people data from native file system or localStorage
export async function clearPeopleFromDevice() {
  if (isNativePlatform()) {
    try {
      await Filesystem.deleteFile({
        path: PEOPLE_FILE_NAME,
        directory: Directory.Data,
      });
    } catch (error) {
      console.warn("People file did not exist", error);
    }
    return;
  }

  const storage = getSafeStorage();
  if (!storage) return;

  storage.removeItem(STORAGE_KEY);
}
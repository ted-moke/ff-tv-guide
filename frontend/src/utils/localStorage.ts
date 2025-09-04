// ... existing code ...

export class LocalStorageManager {
    private static isAvailable(): boolean {
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch(error) {
        console.log("error checking localStorage", error);
        return false;
      }
    }
  
    static getItem<T>(key: string, defaultValue: T): T {
      if (!this.isAvailable()) {
        return defaultValue;
      }
  
      try {
        const item = localStorage.getItem(key);
        if (item === null) {
          return defaultValue;
        }
        const parsedItem = JSON.parse(item);
        return parsedItem;
      } catch(error) {
        console.log("error getting item", error);
        return defaultValue;
      }
    }
  
    static setItem<T>(key: string, value: T): void {
      if (!this.isAvailable()) {
        return;
      }
  
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Silently fail if storage is full or other issues
      }
    }
  
    static removeItem(key: string): void {
      if (!this.isAvailable()) {
        return;
      }
  
      try {
        localStorage.removeItem(key);
      } catch {
        // Silently fail
      }
    }
  
    static clear(): void {
      if (!this.isAvailable()) {
        return;
      }
  
      try {
        localStorage.clear();
      } catch {
        // Silently fail
      }
    }

    static clearAll(): void {
      if (!this.isAvailable()) {
        return;
      }
      
      try {
        localStorage.clear();
      } catch {
        // Silently fail
      }
    }
  }
  
  // Convenience functions for common use cases
  export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => 
    LocalStorageManager.getItem(key, defaultValue);
  
  export const setLocalStorageItem = <T>(key: string, value: T): void => 
    LocalStorageManager.setItem(key, value);
  
  export const removeLocalStorageItem = (key: string): void => 
    LocalStorageManager.removeItem(key);

  export const clearAllStorage = () => 
    LocalStorageManager.clearAll();
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (vehicleId: string) => void;
  isFavorite: (vehicleId: string) => boolean;
  clearAllFavorites: () => void;
  removeFavorites: (vehicleIds: string[]) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_KEY = "favorite-vehicles";

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed.filter((item): item is string => typeof item === "string"));
          }
        }
      } catch (error) {
        console.warn("Failed to load favorites", error);
      }
    };

    void loadFavorites();
  }, []);

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavorites((prev) => {
      const alreadySaved = prev.includes(vehicleId);
      const updatedFavorites = alreadySaved
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];

      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (vehicleId: string) => favorites.includes(vehicleId),
    [favorites]
  );

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, []);

  const removeFavorites = useCallback((vehicleIds: string[]) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((id) => !vehicleIds.includes(id));
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, clearAllFavorites, removeFavorites }),
    [favorites, toggleFavorite, isFavorite, clearAllFavorites, removeFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

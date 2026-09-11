import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

interface SavedResourcesContextType {
  savedKeys: Set<string>;
  loading: boolean;
  saveResource: (resourceType: string, resourceId: string) => Promise<boolean>;
  removeResource: (resourceType: string, resourceId: string) => Promise<boolean>;
  isSaved: (resourceType: string, resourceId: string) => boolean;
}

const SavedResourcesContext = createContext<SavedResourcesContextType | undefined>(undefined);

export const SavedResourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSavedKeys = async () => {
      if (!user) {
        setSavedKeys(new Set());
        return;
      }
      
      setLoading(true);
      try {
        const res = await api.get('/saved-resources/keys');
        if (res.data.status === 'success') {
          setSavedKeys(new Set(res.data.data));
        }
      } catch (error) {
        console.error('Failed to fetch saved resources keys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedKeys();
  }, [user]);

  const saveResource = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user) return false;
    
    const key = `${resourceType}:${resourceId}`;
    
    // Optimistic update
    const newKeys = new Set(savedKeys);
    newKeys.add(key);
    setSavedKeys(newKeys);

    try {
      await api.post('/saved-resources', { resourceType, resourceId });
      return true;
    } catch (error) {
      console.error('Failed to save resource:', error);
      // Rollback
      const revertedKeys = new Set(savedKeys);
      revertedKeys.delete(key);
      setSavedKeys(revertedKeys);
      return false;
    }
  };

  const removeResource = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user) return false;

    const key = `${resourceType}:${resourceId}`;
    
    // Optimistic update
    const newKeys = new Set(savedKeys);
    newKeys.delete(key);
    setSavedKeys(newKeys);

    try {
      await api.delete(`/saved-resources/${resourceType}/${resourceId}`);
      return true;
    } catch (error) {
      console.error('Failed to remove resource:', error);
      // Rollback
      const revertedKeys = new Set(savedKeys);
      revertedKeys.add(key);
      setSavedKeys(revertedKeys);
      return false;
    }
  };

  const isSaved = (resourceType: string, resourceId: string) => {
    return savedKeys.has(`${resourceType}:${resourceId}`);
  };

  return (
    <SavedResourcesContext.Provider value={{ savedKeys, loading, saveResource, removeResource, isSaved }}>
      {children}
    </SavedResourcesContext.Provider>
  );
};

export const useSavedResources = () => {
  const context = useContext(SavedResourcesContext);
  if (context === undefined) {
    throw new Error('useSavedResources must be used within a SavedResourcesProvider');
  }
  return context;
};

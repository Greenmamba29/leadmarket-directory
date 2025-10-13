import { useState } from 'react';
import { processImportedData } from '../utils/formatting.js';

/**
 * Custom hook for handling JSON lead import functionality
 * @returns {Object} - Import state and functions
 */
export function useLeadImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles file import and processing
   * @param {File} file - The file to import
   * @param {Function} onSuccess - Callback function when import succeeds
   * @returns {Promise<void>}
   */
  const importFile = (file, onSuccess) => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const leadsArray = processImportedData(data);
        
        onSuccess(leadsArray);
        setError(null);
      } catch (err) {
        setError(err.message || "Invalid JSON file format.");
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  /**
   * Clears the current error state
   */
  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    importFile,
    clearError,
  };
}
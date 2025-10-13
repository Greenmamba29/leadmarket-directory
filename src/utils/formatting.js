/**
 * Data formatting utility functions
 */

/**
 * Masks an email address by replacing @ symbols with [at]
 */
export const maskEmail = (email) => {
  if (!email) return "";
  return email.replace(/@/g, " [at] ");
};

/**
 * Validates lead data structure for required fields
 */
export function validateLeadData(leadsArray) {
  const requiredFields = ['Name', 'Company', 'Role'];
  const invalidLeads = leadsArray.filter(lead => 
    !requiredFields.every(field => lead[field])
  );
  
  if (invalidLeads.length > 0) {
    throw new Error(`Found ${invalidLeads.length} leads missing required fields (Name, Company, Role).`);
  }
  
  return true;
}

/**
 * Processes imported JSON data into leads array
 */
export function processImportedData(data) {
  let leadsArray = [];
  
  if (Array.isArray(data)) {
    leadsArray = data;
  } else if (Array.isArray(data?.records)) {
    leadsArray = data.records;
  } else {
    throw new Error("JSON must be an array of lead objects or {records: [...]}.");
  }
  
  validateLeadData(leadsArray);
  return leadsArray;
}
/**
 * Validation utilities for UK addresses and postcodes
 */

/**
 * Validates UK postcode format
 * Supports formats like: SW1A 1AA, SW1A1AA, EC1A 1BB, W1A 0AX, etc.
 *
 * Format breakdown:
 * - Area (1-2 letters)
 * - District (1-2 digits)
 * - Optional sector letter
 * - Space (optional)
 * - Sector (1 digit)
 * - Unit (2 letters)
 *
 * @param postcode - The postcode to validate
 * @returns true if valid UK postcode format
 */
export function validateUKPostcode(postcode: string): boolean {
  if (!postcode || typeof postcode !== 'string') {
    return false;
  }

  // UK postcode regex pattern
  // Matches: SW1A 1AA, SW1A1AA, EC1A 1BB, W1A 0AX, etc.
  const ukPostcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;

  return ukPostcodeRegex.test(postcode.replace(/\s/g, ''));
}

/**
 * Formats UK postcode to standard format (uppercase with space)
 *
 * Examples:
 * - "sw1a1aa" → "SW1A 1AA"
 * - "SW1A1AA" → "SW1A 1AA"
 * - "ec1a 1bb" → "EC1A 1BB"
 *
 * @param postcode - The postcode to format
 * @returns Formatted postcode with uppercase and proper spacing
 */
export function formatUKPostcode(postcode: string): string {
  if (!postcode || typeof postcode !== 'string') {
    return '';
  }

  // Remove all spaces and convert to uppercase
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();

  // Insert space before last 3 characters (sector + unit)
  if (cleaned.length >= 5 && cleaned.length <= 7) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }

  return cleaned;
}

/**
 * Interface for address validation result
 */
export interface AddressValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a complete address object
 * Checks for required fields and valid postcode format
 *
 * @param address - The address object to validate
 * @returns Validation result with errors array
 */
export function validateAddress(address: {
  address_line1?: string;
  city?: string;
  postcode?: string;
}): AddressValidation {
  const errors: string[] = [];

  // Validate address line 1
  if (!address.address_line1 || address.address_line1.trim().length === 0) {
    errors.push('Address line 1 is required');
  } else if (address.address_line1.trim().length < 3) {
    errors.push('Address line 1 must be at least 3 characters');
  }

  // Validate city
  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required');
  } else if (address.city.trim().length < 2) {
    errors.push('City must be at least 2 characters');
  }

  // Validate postcode
  if (!address.postcode || address.postcode.trim().length === 0) {
    errors.push('Postcode is required');
  } else if (!validateUKPostcode(address.postcode)) {
    errors.push('Invalid UK postcode format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 *
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 200); // Limit length
}

import { SwedishCounty, AssociationCategory } from "./constants";

export function formatOrganizationNumber(orgNumber: string): string {
  // Remove all non-digit characters
  const clean = orgNumber.replace(/\D/g, "");

  // Format as XXXXXX-XXXX
  if (clean.length === 10) {
    return `${clean.slice(0, 6)}-${clean.slice(6)}`;
  }

  return orgNumber;
}

export function formatPostalCode(postalCode: string): string {
  // Remove all non-digit characters
  const clean = postalCode.replace(/\D/g, "");

  // Format as XXX XX
  if (clean.length === 5) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }

  return postalCode;
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const clean = phone.replace(/[^\d+]/g, "");

  // Format Swedish phone numbers
  if (clean.startsWith("0046")) {
    return clean.replace("0046", "+46");
  }

  if (clean.startsWith("0") && clean.length > 2) {
    return clean.replace("0", "+46");
  }

  return clean;
}

export function validateOrganizationNumber(orgNumber: string): boolean {
  const formatted = formatOrganizationNumber(orgNumber);
  const pattern = /^\d{6}-\d{4}$/;

  if (!pattern.test(formatted)) return false;

  const digits = formatted
    .replace("-", "")
    .split("")
    .map((d) => parseInt(d, 10));

  // Luhn algorithm
  let sum = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    let digit = digits[i];
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[digits.length - 1];
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[åä]/g, "a")
    .replace(/[ö]/g, "o")
    .replace(/[^a-z0-9\s]/g, "");
}

export function calculateRelevanceScore(
  searchTerm: string,
  associationName: string,
  description?: string,
): number {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedName = normalizeString(associationName);
  const normalizedDescription = description ? normalizeString(description) : "";

  let score = 0;

  // Exact name match
  if (normalizedName === normalizedSearch) {
    score += 100;
  }

  // Name starts with search term
  if (normalizedName.startsWith(normalizedSearch)) {
    score += 50;
  }

  // Name contains search term
  if (normalizedName.includes(normalizedSearch)) {
    score += 25;
  }

  // Description contains search term
  if (normalizedDescription.includes(normalizedSearch)) {
    score += 10;
  }

  // Word-based matching
  const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 2);
  const nameWords = normalizedName.split(" ");

  searchWords.forEach((searchWord) => {
    nameWords.forEach((nameWord) => {
      if (nameWord === searchWord) {
        score += 15;
      } else if (nameWord.includes(searchWord)) {
        score += 5;
      }
    });
  });

  return score;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(error);
        } else {
          setTimeout(attempt, delay * attempts);
        }
      }
    };

    attempt();
  });
}

/**
 * DeedFlow Enterprise Structured PII-Safe Logger
 *
 * Automatically scrubs sensitive Personally Identifiable Information (PII)
 * including 12-digit Aadhaar numbers, 10-character PAN identifiers, and contact details
 * prior to outputting to console, telemetry, or audit pipelines.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  timestamp: string;
}

// Regex patterns for sensitive Indian PII
const AADHAAR_REGEX = /\b(\d{4})[- ]?(\d{4})[- ]?(\d{4})\b/g;
const PAN_REGEX = /\b([A-Z]{5})(\d{4})([A-Z]{1})\b/g;
const PHONE_REGEX = /\b(?:\+?91[\s-]?)?([6-9]\d{4})[\s-]?(\d{5})\b/g;

/**
 * Recursively masks PII in strings, objects, and arrays.
 */
export function scrubPII(input: any): any {
  if (typeof input === "string") {
    return input
      .replace(AADHAAR_REGEX, "XXXX-XXXX-$3")
      .replace(PAN_REGEX, "$1****$3")
      .replace(PHONE_REGEX, "+91 XXXXX $2");
  }

  if (Array.isArray(input)) {
    return input.map((item) => scrubPII(item));
  }

  if (input !== null && typeof input === "object") {
    const scrubbed: Record<string, any> = {};
    for (const [key, val] of Object.entries(input)) {
      // Sensitive field name heuristics
      if (
        /aadhaar|adhaar|uidai/i.test(key) &&
        typeof val === "string"
      ) {
        scrubbed[key] = val.slice(-4).padStart(12, "X");
      } else if (
        /pan|taxid/i.test(key) &&
        typeof val === "string" &&
        val.length === 10
      ) {
        scrubbed[key] = `${val.slice(0, 5)}****${val.slice(-1)}`;
      } else if (
        /phone|mobile|whatsapp/i.test(key) &&
        typeof val === "string"
      ) {
        scrubbed[key] = val.length > 4 ? `+91 XXXXX ${val.slice(-4)}` : "XXXXX";
      } else {
        scrubbed[key] = scrubPII(val);
      }
    }
    return scrubbed;
  }

  return input;
}

function formatLog(payload: LogPayload): string {
  const prefix = `[DeedFlow][${payload.timestamp}][${payload.level.toUpperCase()}][${payload.context || "System"}]`;
  const sanitizedMsg = scrubPII(payload.message);
  return `${prefix} ${sanitizedMsg}`;
}

export const logger = {
  debug(message: string, context?: string, data?: any) {
    if (process.env.NODE_ENV !== "production") {
      const payload: LogPayload = {
        level: "debug",
        message,
        context,
        data: scrubPII(data),
        timestamp: new Date().toISOString(),
      };
      console.debug(formatLog(payload), payload.data || "");
    }
  },

  info(message: string, context?: string, data?: any) {
    const payload: LogPayload = {
      level: "info",
      message,
      context,
      data: scrubPII(data),
      timestamp: new Date().toISOString(),
    };
    console.info(formatLog(payload), payload.data ? JSON.stringify(payload.data) : "");
  },

  warn(message: string, context?: string, data?: any) {
    const payload: LogPayload = {
      level: "warn",
      message,
      context,
      data: scrubPII(data),
      timestamp: new Date().toISOString(),
    };
    console.warn(formatLog(payload), payload.data ? JSON.stringify(payload.data) : "");
  },

  error(message: string, context?: string, error?: any) {
    const payload: LogPayload = {
      level: "error",
      message,
      context,
      data: scrubPII(
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error
      ),
      timestamp: new Date().toISOString(),
    };
    console.error(formatLog(payload), payload.data || "");
  },
};

/**
 * Deterministic Indian Currency to Words Converter
 * Conforms strictly to Indian numbering format (Lakhs, Crores).
 * Zero hallucinations - 100% mathematical precision.
 */

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertLessThanOneThousand(n: number): string {
  let result = "";

  if (n >= 100) {
    result += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }

  if (n >= 20) {
    result += TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }

  if (n > 0) {
    result += ONES[n] + " ";
  }

  return result.trim();
}

/**
 * Converts a numeric value in Indian Rupees into official legal words.
 * Example: 14580000 -> "Rupees One Crore Forty Five Lakhs Eighty Thousand Only"
 */
export function convertIndianCurrencyToWords(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rupees Zero Only";
  }

  if (amount === 0) {
    return "Rupees Zero Only";
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  let num = integerPart;
  let words = "";

  // Crores (1,00,00,000)
  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  if (crores > 0) {
    words += convertIndianCurrencyToWordsHelper(crores) + " Crore ";
  }

  // Lakhs (1,00,000)
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  if (lakhs > 0) {
    words += convertIndianCurrencyToWordsHelper(lakhs) + " Lakh" + (lakhs > 1 ? "s " : " ");
  }

  // Thousands (1,000)
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  if (thousands > 0) {
    words += convertIndianCurrencyToWordsHelper(thousands) + " Thousand ";
  }

  // Hundreds & units
  if (num > 0) {
    words += convertLessThanOneThousand(num) + " ";
  }

  words = words.trim();

  let finalString = "Rupees " + (words || "Zero");

  if (decimalPart > 0) {
    const paiseWords = convertLessThanOneThousand(decimalPart);
    finalString += " and " + paiseWords + " Paise";
  }

  finalString += " Only";

  return isNegative ? "Minus " + finalString : finalString;
}

function convertIndianCurrencyToWordsHelper(n: number): string {
  if (n === 0) return "";
  if (n < 1000) return convertLessThanOneThousand(n);

  let result = "";
  const cr = Math.floor(n / 10000000);
  n %= 10000000;
  if (cr > 0) result += convertLessThanOneThousand(cr) + " Crore ";

  const lk = Math.floor(n / 100000);
  n %= 100000;
  if (lk > 0) result += convertLessThanOneThousand(lk) + " Lakh" + (lk > 1 ? "s " : " ");

  const th = Math.floor(n / 1000);
  n %= 1000;
  if (th > 0) result += convertLessThanOneThousand(th) + " Thousand ";

  if (n > 0) result += convertLessThanOneThousand(n);

  return result.trim();
}

/**
 * Formats a number with Indian Lakh / Crore commas.
 * Example: 14580000 -> "₹1,45,80,000"
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

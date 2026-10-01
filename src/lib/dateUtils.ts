// Bengali Date & Numeral Utilities for "ঢাকা" News Portal

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumerals(input: number | string): string {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)] || digit);
}

const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

const BENGALI_GREGORIAN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const BANGLA_MONTHS = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];

/**
 * Returns Gregorian date in Bengali (e.g., "বৃহস্পতিবার, ১ অক্টোবর ২০২৬")
 */
export function getFormattedBengaliDate(dateInput: Date | string = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const dayName = BENGALI_DAYS[d.getDay()];
  const dayNumber = toBengaliNumerals(d.getDate());
  const monthName = BENGALI_GREGORIAN_MONTHS[d.getMonth()];
  const yearNumber = toBengaliNumerals(d.getFullYear());

  return `${dayName}, ${dayNumber} ${monthName} ${yearNumber}`;
}

/**
 * Approximates traditional Bangla calendar date (বঙ্গাব্দ) for the given date.
 */
export function getTraditionalBanglaDate(dateInput: Date | string = new Date()): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Bengali New Year starts roughly April 14
  let banglaYear = year - 593;
  if (month < 3 || (month === 3 && day < 14)) {
    banglaYear -= 1;
  }

  // Days in Bangla months: Boishakh to Bhadro: 31 days each, Ashwin to Choitro: 30 days
  const monthStarts = [
    { m: 3, d: 14, name: 'বৈশাখ' },
    { m: 4, d: 15, name: 'জ্যৈষ্ঠ' },
    { m: 5, d: 15, name: 'আষাঢ়' },
    { m: 6, d: 16, name: 'শ্রাবণ' },
    { m: 7, d: 16, name: 'ভাদ্র' },
    { m: 8, d: 16, name: 'আশ্বিন' },
    { m: 9, d: 16, name: 'কার্তিক' },
    { m: 10, d: 16, name: 'অগ্রহায়ণ' },
    { m: 11, d: 16, name: 'পৌষ' },
    { m: 0, d: 15, name: 'মাঘ' },
    { m: 1, d: 14, name: 'ফাল্গুন' },
    { m: 2, d: 15, name: 'চৈত্র' },
  ];

  let currentBanglaMonth = 'বৈশাখ';
  let banglaDay = 1;

  for (let i = monthStarts.length - 1; i >= 0; i--) {
    const start = monthStarts[i];
    if (month > start.m || (month === start.m && day >= start.d)) {
      currentBanglaMonth = start.name;
      // Calculate day difference
      const gDate = new Date(year, month, day);
      const sDate = new Date(year, start.m, start.d);
      const diffTime = Math.abs(gDate.getTime() - sDate.getTime());
      banglaDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      break;
    }
  }

  return `${toBengaliNumerals(banglaDay)} ${currentBanglaMonth} ${toBengaliNumerals(banglaYear)}`;
}

/**
 * Returns human-readable relative time in Bengali (e.g. "১০ মিনিট আগে", "২ ঘণ্টা আগে", "৩ দিন আগে")
 */
export function getRelativeTimeBengali(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'এইমাত্র';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toBengaliNumerals(diffInMinutes)} মিনিট আগে`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toBengaliNumerals(diffInHours)} ঘণ্টা আগে`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'গতকাল';
  }
  if (diffInDays < 30) {
    return `${toBengaliNumerals(diffInDays)} দিন আগে`;
  }

  return getFormattedBengaliDate(d);
}

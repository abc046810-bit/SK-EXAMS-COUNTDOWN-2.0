import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMS_PATH = path.resolve(__dirname, '../public/data/exams.json');

const VALID_CATEGORIES = new Set([
  'national-competitive',
  'engineering',
  'medical',
  'university',
  'central-govt',
  'rajasthan-govt',
  'other-state-govt',
  'state-boards',
  'cbse-icse',
  'defence',
  'banking-railway',
  'other-important'
]);

const VALID_STATUSES = new Set([
  'official',
  'tentative',
  'date-awaited',
  'postponed',
  'revised',
  'cancelled'
]);

export function validateExamsFile(filePath = EXAMS_PATH) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (!data || !Array.isArray(data.exams) || data.exams.length === 0) {
    throw new Error('exams.json must contain a non-empty "exams" array.');
  }
  if (!data.lastUpdated || Number.isNaN(Date.parse(data.lastUpdated))) {
    throw new Error('exams.json must include a valid ISO "lastUpdated" timestamp.');
  }

  const seenIds = new Set();
  const errors = [];

  for (const [idx, exam] of data.exams.entries()) {
    const label = `Exam[${idx}] (${exam?.id || 'missing-id'})`;
    if (!exam.id || typeof exam.id !== 'string') errors.push(`${label}: missing string id`);
    else if (seenIds.has(exam.id)) errors.push(`${label}: duplicate id "${exam.id}"`);
    else seenIds.add(exam.id);

    if (!exam.shortName) errors.push(`${label}: missing shortName`);
    if (!exam.fullName) errors.push(`${label}: missing fullName`);
    if (!VALID_CATEGORIES.has(exam.category)) errors.push(`${label}: invalid category "${exam.category}"`);
    if (!VALID_STATUSES.has(exam.status)) errors.push(`${label}: invalid status "${exam.status}"`);

    if (exam.date !== null && exam.date !== undefined) {
      if (Number.isNaN(Date.parse(exam.date))) {
        errors.push(`${label}: invalid ISO date "${exam.date}"`);
      } else if (!exam.date.endsWith('+05:30')) {
        errors.push(`${label}: date must use Asia/Kolkata (+05:30) offset`);
      }
    }
    if (exam.endDate && Number.isNaN(Date.parse(exam.endDate))) {
      errors.push(`${label}: invalid endDate "${exam.endDate}"`);
    }
    if (!exam.officialSourceUrl || !exam.officialSourceUrl.startsWith('https://')) {
      errors.push(`${label}: missing valid HTTPS officialSourceUrl`);
    }
    if (!exam.lastVerified || !/^\d{4}-\d{2}-\d{2}$/.test(exam.lastVerified)) {
      errors.push(`${label}: lastVerified must be YYYY-MM-DD`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Exam database validation failed:\n - ${errors.join('\n - ')}`);
  }

  return { count: data.exams.length, lastUpdated: data.lastUpdated };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateExamsFile();
  console.log(`✓ Validated ${result.count} exams in public/data/exams.json (lastUpdated: ${result.lastUpdated})`);
}

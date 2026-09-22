/**
 * Urugendo Answer Document Parser
 * Parses extracted raw text into a questionNumber -> correctOption map.
 * Supports standard, Kinyarwanda, French, and tabular layouts.
 */

/**
 * Text normalization: strips zero-width / non-breaking spaces, normalizes
 * dashes, quotes, linebreaks, etc.
 */
export const normalizeAnswerText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
};

/**
 * Parses raw text extracted from an answer key document.
 * @param {string} rawText - Raw text extracted from PDF
 * @returns {{ answerMap: Map<number, string>, rawCount: number, duplicates: Array<number> }}
 */
export const parseAnswers = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return { answerMap: new Map(), rawCount: 0, duplicates: [] };
  }

  const cleanText = normalizeAnswerText(rawText);
  const answerMap = new Map();
  const duplicates = [];

  // 1. Direct and prefixed answer patterns:
  // Examples:
  // "1. B", "1 - B", "1: B", "1) B", "1 = B", "1 B", "1.B"
  // "Q1: B", "Question 1: B", "No 1: B", "N° 1: B"
  // "Ikibazo cya 1: B", "Ikibazo 1: B"
  // "1. Igisubizo: B", "1. Igisubizo ni B", "1. Igisubizo nyacyo ni B"
  // "1. Answer: B", "1. Answer is B", "1. Reponse: B"
  // "1. B. 40 km/h", "1. B (Ikirore)"
  const answerRegex = /(?:(?:Question|Q\.?|Ikibazo(?:\s+cya|\s+cy'?)?|Ibibazo|N[°o]\.?|Item)\s*)?(?:\((\d+)\)|\[(\d+)\]|(\d+))\s*[\.:)\/—–\-=]?\s*(?:(?:Igisubizo(?:\s+(?:cyiza|nyacyo|cy'ukuri))?(?:\s*ni)?|Answer(?:\s*is)?|R[eé]ponse(?:\s*est)?)\s*[:\s=]*)?\s*\(?([A-Ha-h])\)?(?:\s*[\.;,\)\-]|\s+|$)/gi;

  const matches = [...cleanText.matchAll(answerRegex)];

  for (const match of matches) {
    const qNum = parseInt(match[1] || match[2] || match[3], 10);
    const optionLetter = (match[4] || '').toUpperCase();

    if (isNaN(qNum) || !optionLetter) continue;

    if (answerMap.has(qNum)) {
      duplicates.push(qNum);
    } else {
      answerMap.set(qNum, optionLetter);
    }
  }

  // 2. Fallback: Check for Tabular / Grid Format if no answers found
  // e.g.
  // 1   2   3   4   5
  // A   B   C   D   A
  if (answerMap.size === 0) {
    const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length - 1; i++) {
      const rowA = lines[i].split(/\s+/);
      const rowB = lines[i + 1].split(/\s+/);

      const allNumsA = rowA.length >= 2 && rowA.every((v) => /^\d+$/.test(v));
      const allLettersB = rowB.length === rowA.length && rowB.every((v) => /^[A-Ha-h]$/i.test(v));

      if (allNumsA && allLettersB) {
        for (let j = 0; j < rowA.length; j++) {
          const num = parseInt(rowA[j], 10);
          const letter = rowB[j].toUpperCase();
          if (!isNaN(num) && letter) {
            if (answerMap.has(num)) {
              duplicates.push(num);
            } else {
              answerMap.set(num, letter);
            }
          }
        }
        i++; // skip letters row
      }
    }
  }

  return {
    answerMap,
    rawCount: answerMap.size + duplicates.length,
    duplicates,
  };
};

export default {
  parseAnswers,
  normalizeAnswerText,
};

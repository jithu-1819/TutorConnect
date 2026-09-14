const TutorProfile = require('../models/TutorProfile');
const Availability = require('../models/Availability');

/**
 * Parse time string "HH:MM" to minutes since midnight for comparison
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Map common time-of-day keywords to hour ranges
 */
function parsePreferredTimeWindow(preferredTime) {
  if (!preferredTime) return null;
  const lower = preferredTime.toLowerCase();

  if (lower.includes('morning'))  return { start: 6 * 60, end: 12 * 60 };
  if (lower.includes('afternoon')) return { start: 12 * 60, end: 17 * 60 };
  if (lower.includes('evening'))  return { start: 17 * 60, end: 21 * 60 };
  if (lower.includes('night'))    return { start: 19 * 60, end: 23 * 60 };
  if (lower.includes('weekend'))  return { weekend: true };

  // Try to extract an hour like "after 5pm" or "before 3pm"
  const afterMatch = lower.match(/after\s+(\d{1,2})\s*(am|pm)?/i);
  if (afterMatch) {
    let hour = parseInt(afterMatch[1]);
    if (afterMatch[2]?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    return { start: hour * 60, end: 23 * 60 };
  }

  const beforeMatch = lower.match(/before\s+(\d{1,2})\s*(am|pm)?/i);
  if (beforeMatch) {
    let hour = parseInt(beforeMatch[1]);
    if (beforeMatch[2]?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    return { start: 0, end: hour * 60 };
  }

  return null;
}

/**
 * Related-terms map for tech subjects.
 * If a user types "frontend", inject related keywords so tutors
 * teaching React, CSS, HTML etc. get a higher subject score.
 */
const SYNONYM_MAP = {
  frontend:   ['react', 'html', 'css', 'javascript', 'typescript', 'nextjs', 'next', 'ui', 'tailwind', 'vue', 'angular', 'responsive', 'component'],
  backend:    ['node', 'nodejs', 'express', 'expressjs', 'rest', 'api', 'graphql', 'server', 'mongodb', 'postgresql', 'database', 'sql'],
  fullstack:  ['react', 'node', 'mongodb', 'express', 'mern', 'full', 'stack', 'web', 'frontend', 'backend'],
  'full-stack': ['react', 'node', 'mongodb', 'express', 'mern', 'full', 'stack', 'web', 'frontend', 'backend'],
  mern:       ['mongodb', 'express', 'react', 'node', 'nodejs', 'javascript', 'frontend', 'backend', 'full', 'stack', 'web'],
  mean:       ['mongodb', 'express', 'angular', 'node', 'nodejs', 'javascript', 'frontend', 'backend'],
  stack:      ['react', 'node', 'mongodb', 'express', 'frontend', 'backend', 'full', 'mern', 'web'],
  ai:         ['machine', 'learning', 'deep', 'tensorflow', 'pytorch', 'neural', 'nlp', 'artificial', 'intelligence', 'ml'],
  ml:         ['machine', 'learning', 'deep', 'tensorflow', 'pytorch', 'neural', 'model', 'regression', 'classification'],
  'machine learning': ['ml', 'deep', 'tensorflow', 'pytorch', 'neural', 'regression', 'classification', 'ai'],
  devops:     ['docker', 'kubernetes', 'cicd', 'ci', 'cd', 'aws', 'cloud', 'jenkins', 'terraform', 'linux', 'container'],
  cloud:      ['aws', 'azure', 'gcp', 'devops', 'docker', 'kubernetes', 'lambda', 'serverless', 'ec2'],
  mobile:     ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'app'],
  app:        ['mobile', 'react native', 'flutter', 'ios', 'android'],
  cybersecurity: ['security', 'hacking', 'ethical', 'penetration', 'network', 'kali', 'owasp'],
  security:   ['cybersecurity', 'hacking', 'ethical', 'penetration', 'network', 'firewall'],
  data:       ['data science', 'sql', 'pandas', 'analytics', 'visualization', 'tableau', 'power bi', 'statistics'],
  database:   ['sql', 'mongodb', 'postgresql', 'mysql', 'nosql', 'redis'],
  dsa:        ['data structures', 'algorithms', 'leetcode', 'competitive', 'programming', 'trees', 'graphs', 'dynamic'],
  interview:  ['dsa', 'data structures', 'algorithms', 'system design', 'leetcode', 'coding'],
  web:        ['html', 'css', 'javascript', 'react', 'node', 'web development', 'frontend', 'backend'],
  java:       ['spring', 'springboot', 'spring boot', 'jpa', 'microservices', 'enterprise', 'oop'],
};

/**
 * Extract keywords from text for matching, expanding with synonyms
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'i', 'me', 'my', 'need', 'want', 'help', 'with', 'the', 'a', 'an',
    'for', 'to', 'in', 'of', 'and', 'or', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'can', 'may', 'might',
    'looking', 'find', 'get', 'some', 'very', 'really', 'prefer',
    'am', 'before', 'after', 'under', 'over', 'about', 'like',
    'learn', 'study', 'teach', 'tutor', 'course', 'class', 'lesson',
  ]);

  const raw = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));

  // Expand with synonyms
  const expanded = new Set(raw);
  for (const word of raw) {
    if (SYNONYM_MAP[word]) {
      SYNONYM_MAP[word].forEach((syn) => expanded.add(syn));
    }
  }

  // Also check multi-word phrases from the original text
  const lowerText = text.toLowerCase();
  for (const phrase of Object.keys(SYNONYM_MAP)) {
    if (phrase.includes(' ') && lowerText.includes(phrase)) {
      expanded.add(phrase.replace(/\s+/g, ''));
      SYNONYM_MAP[phrase].forEach((syn) => expanded.add(syn));
    }
  }

  return [...expanded];
}

/**
 * Step 1 — Hard filter: pull approved tutors matching constraints
 */
async function filterTutors(queryText, budget) {
  const filter = { isApproved: true };

  if (budget && budget > 0) {
    filter.hourlyRate = { $lte: budget };
  }

  const tutors = await TutorProfile.find(filter)
    .populate('userId', 'name email');

  // Filter out orphaned profiles where userId population failed
  return tutors.filter((t) => t.userId != null);
}

/**
 * Step 2 — Scoring engine (weighted composite score)
 *
 * Weights:
 *   Subject relevance:  40%
 *   Average rating:     25%
 *   Price fit:          20%
 *   Availability match: 15%
 */
async function scoreTutors(tutors, queryText, budget, preferredTime) {
  const keywords = extractKeywords(queryText);
  const timeWindow = parsePreferredTimeWindow(preferredTime);

  const scored = await Promise.all(
    tutors.map(async (tutor) => {
      // ---- Subject relevance (40%) ----
      const tutorText = [
        ...tutor.subjects,
        tutor.bio,
      ].join(' ').toLowerCase();

      let keywordHits = 0;
      for (const kw of keywords) {
        if (tutorText.includes(kw)) keywordHits++;
      }
      const subjectScore = keywords.length > 0
        ? Math.min(keywordHits / keywords.length, 1.0)
        : 0.5; // neutral if no keywords

      // ---- Average rating (25%) ----
      const ratingScore = tutor.averageRating / 5;

      // ---- Price fit (20%) ----
      let priceScore = 0.5; // neutral default
      if (budget && budget > 0) {
        priceScore = Math.max(0, 1 - tutor.hourlyRate / budget);
      }

      // ---- Availability match (15%) ----
      let availScore = 0.5; // neutral default
      if (timeWindow) {
        const slots = await Availability.find({
          tutorId: tutor.userId._id,
          isBooked: false,
        });

        if (timeWindow.weekend) {
          const weekendSlots = slots.filter(
            (s) => s.dayOfWeek === 'saturday' || s.dayOfWeek === 'sunday'
          );
          availScore = weekendSlots.length > 0 ? 1.0 : 0.0;
        } else if (timeWindow.start !== undefined) {
          const matchingSlots = slots.filter((s) => {
            const start = timeToMinutes(s.startTime);
            return start >= timeWindow.start && start < timeWindow.end;
          });
          availScore = matchingSlots.length > 0 ? 1.0 : 0.0;
        }
      }

      const compositeScore =
        subjectScore * 0.4 +
        ratingScore * 0.25 +
        priceScore * 0.2 +
        availScore * 0.15;

      return {
        tutor,
        scores: {
          subject: subjectScore,
          rating: ratingScore,
          price: priceScore,
          availability: availScore,
          composite: Math.round(compositeScore * 1000) / 1000,
        },
      };
    })
  );

  // Sort by composite score descending, return top 5
  scored.sort((a, b) => b.scores.composite - a.scores.composite);
  return scored.slice(0, 5);
}

module.exports = { filterTutors, scoreTutors };

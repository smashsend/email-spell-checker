import { DistanceFunction } from '../types';

interface FindClosestDomainProps {
  domain: string;
  domains: string[];
  distanceFunction: DistanceFunction;
  desiredThreshold?: number;
  threshold: number;
  // Optional candidate to favour when ranking. Its distance is reduced by
  // `bias` for comparison only; the threshold still applies to the raw distance.
  preferred?: { domain: string; bias: number };
}

function findClosestDomain(opts: FindClosestDomainProps): string | undefined {
  const { domain, domains, distanceFunction, threshold, preferred } = opts;

  let dist;
  let score;
  let minScore = Infinity;
  let minDist = Infinity;
  let closestDomain = null;

  if (!domain || !domains) {
    return undefined;
  }

  for (let i = 0; i < domains.length; i++) {
    if (domain === domains[i]) {
      return domain;
    }
    dist = distanceFunction(domain, domains[i]);
    if (preferred && dist > threshold) {
      // Out-of-range candidates must not win the ranking thanks to the bias.
      continue;
    }
    score =
      preferred && domains[i] === preferred.domain
        ? dist - preferred.bias
        : dist;
    if (score < minScore) {
      minScore = score;
      minDist = dist;
      closestDomain = domains[i];
    }
  }

  if (minDist <= threshold && closestDomain !== null) {
    return closestDomain;
  } else {
    return undefined;
  }
}

export default findClosestDomain;

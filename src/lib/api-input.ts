export interface PaginationInput {
  page: number;
  limit: number;
  offset: number;
}

export function parsePositiveInteger(
  value: string | null | undefined,
  fallback: number
): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaultLimit = 10,
  maxLimit = 100
): PaginationInput {
  const page = parsePositiveInteger(searchParams.get('page'), 1);
  const requestedLimit = parsePositiveInteger(
    searchParams.get('limit'),
    defaultLimit
  );
  const limit = Math.min(requestedLimit, maxLimit);

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

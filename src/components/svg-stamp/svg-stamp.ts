let nextStampFilterId = 0;

export function createStampFilterId(): string {
  nextStampFilterId += 1;
  return `svg-stamp-filter-${nextStampFilterId}`;
}

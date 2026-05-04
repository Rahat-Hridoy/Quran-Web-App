export class PaginationMetadata {
  total!: number;
  page!: number;
  last_page!: number;
}

export class PaginatedResponseDto<T> {
  metadata!: PaginationMetadata;
  data!: T[];
}

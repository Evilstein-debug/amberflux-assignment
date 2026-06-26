// A typed error that controllers can catch and turn into clean HTTP responses.
// Separates "expected" domain errors (e.g. 404 Not Found) from unexpected crashes.
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

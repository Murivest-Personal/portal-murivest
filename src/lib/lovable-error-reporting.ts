export function reportLovableError(error: unknown, options?: { boundary?: string }): void {
  try {
    console.error(
      `[lovable-error-reporting]${options?.boundary ? ` boundary=${options.boundary}` : ""}`,
      error,
    );
  } catch {
    // Error reporting must never throw.
  }
}

export function createRunId() {
  return `run_${Date.now()}`;
}

export function hashContent(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return `h_${Math.abs(hash)}`;
}

export function isAuthorizedCronRequest(authHeader: string | null, secret: string | undefined) {
  if (!secret) {
    return true;
  }

  return authHeader === `Bearer ${secret}`;
}

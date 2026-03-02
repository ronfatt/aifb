import { env } from "@/lib/env";

function getGraphVersion() {
  return env.META_GRAPH_VERSION || "v22.0";
}

export interface MetaApiErrorShape {
  error?: {
    message?: string;
    code?: number;
    error_subcode?: number;
    type?: string;
  };
}

export class MetaApiError extends Error {
  status: number;
  code?: number;
  subcode?: number;
  errorType: "auth" | "rate_limit" | "transient" | "validation" | "unknown";
  payload?: Record<string, unknown>;

  constructor(args: {
    message: string;
    status: number;
    code?: number;
    subcode?: number;
    errorType: "auth" | "rate_limit" | "transient" | "validation" | "unknown";
    payload?: Record<string, unknown>;
  }) {
    super(args.message);
    this.name = "MetaApiError";
    this.status = args.status;
    this.code = args.code;
    this.subcode = args.subcode;
    this.errorType = args.errorType;
    this.payload = args.payload;
  }
}

export function classifyMetaError(status: number, payload?: MetaApiErrorShape) {
  const code = payload?.error?.code;

  if (status === 401 || status === 403 || code === 190 || code === 10) {
    return "auth" as const;
  }

  if (status === 429 || code === 4 || code === 17 || code === 32 || code === 613) {
    return "rate_limit" as const;
  }

  if (status >= 500) {
    return "transient" as const;
  }

  if (status >= 400 && status < 500) {
    return "validation" as const;
  }

  return "unknown" as const;
}

export function shouldRetryMetaError(error: unknown) {
  if (error instanceof MetaApiError) {
    return error.errorType === "rate_limit" || error.errorType === "transient";
  }

  return true;
}

export function buildGraphUrl(path: string, params?: URLSearchParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`https://graph.facebook.com/${getGraphVersion()}${normalizedPath}`);

  if (params) {
    url.search = params.toString();
  }

  return url.toString();
}

export function getMetaPageToken() {
  return env.META_PAGE_ACCESS_TOKEN;
}

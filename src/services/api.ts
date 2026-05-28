export type DeckVisibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
export type CardDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ReviewResult = 'AGAIN' | 'GOOD';

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthPayload = {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
};

export type Owner = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type DeckSummary = {
  id: string;
  title: string;
  description: string | null;
  visibility: DeckVisibility;
  ownerId: string;
  isOwner: boolean;
  isSaved: boolean;
  cardCount: number;
  tags: string[];
};

export type DeckDetail = DeckSummary & {
  saveCount: number;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  forkedFromDeckId: string | null;
};

export type CommunityDeckSummary = {
  id: string;
  title: string;
  description: string | null;
  visibility: DeckVisibility;
  ownerId: string;
  owner: Owner;
  cardCount: number;
  saveCount: number;
  tags: Tag[];
};

export type CommunityDeckDetail = CommunityDeckSummary & {
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
};

export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  explanation: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  difficulty: CardDifficulty;
  position: number;
  isArchived: boolean;
  forkedFromCardId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DueCard = {
  progressId: string;
  cardId: string;
  leitnerBox: number;
  dueAt: string;
  card: Card;
};

export type StudyStats = {
  totalCards: number;
  dueCards: number;
  cardsByBox: Record<string, number>;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  accuracyPercentage: number;
  lastReviewedAt: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  pagination?: Pagination;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

type QueryValue = string | number | boolean | undefined | null;

type RequestOptions = {
  auth?: boolean;
  body?: unknown;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST';
  query?: Record<string, QueryValue>;
  skipRefresh?: boolean;
};

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333'
).replace(/\/$/, '');

let accessToken: string | null = null;
let refreshToken: string | null = null;
let sessionListener: ((payload: AuthPayload | null) => void) | null = null;

export function setApiSession(payload: AuthPayload | null): void {
  accessToken = payload?.accessToken ?? null;
  refreshToken = payload?.refreshToken ?? null;
}

export function setApiSessionListener(
  listener: ((payload: AuthPayload | null) => void) | null,
): void {
  sessionListener = listener;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();

  if (!text) {
    return { success: true, data: undefined as T };
  }

  return JSON.parse(text) as ApiResponse<T>;
}

async function refreshCurrentSession(): Promise<boolean> {
  if (!refreshToken) {
    return false;
  }

  const response = await fetch(buildUrl('/auth/refresh'), {
    body: JSON.stringify({ refreshToken }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const payload = await parseResponse<AuthPayload>(response);

  if (!response.ok || !payload.success) {
    setApiSession(null);
    sessionListener?.(null);
    return false;
  }

  setApiSession(payload.data);
  sessionListener?.(payload.data);
  return true;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildUrl(path, options.query), {
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers,
    method: options.method ?? 'GET',
  });

  if (
    response.status === 401 &&
    options.auth !== false &&
    !options.skipRefresh
  ) {
    const refreshed = await refreshCurrentSession();
    if (refreshed) {
      return request<T>(path, { ...options, skipRefresh: true });
    }
  }

  const payload = await parseResponse<T>(response);

  if (!response.ok || !payload.success) {
    const error = payload.success ? null : payload.error;
    throw new ApiError(
      error?.message ?? 'Request failed',
      error?.code ?? 'REQUEST_FAILED',
      response.status,
    );
  }

  return payload.data;
}

async function requestList<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T[]; pagination: Pagination }> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.auth !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(buildUrl(path, options.query), {
    headers,
    method: options.method ?? 'GET',
  });

  if (
    response.status === 401 &&
    options.auth !== false &&
    !options.skipRefresh
  ) {
    const refreshed = await refreshCurrentSession();
    if (refreshed) {
      return requestList<T>(path, { ...options, skipRefresh: true });
    }
  }

  const payload = await parseResponse<T[]>(response);

  if (!response.ok || !payload.success) {
    const error = payload.success ? null : payload.error;
    throw new ApiError(
      error?.message ?? 'Request failed',
      error?.code ?? 'REQUEST_FAILED',
      response.status,
    );
  }

  return {
    data: payload.data,
    pagination: payload.pagination ?? {
      page: 1,
      limit: payload.data.length,
      total: payload.data.length,
      totalPages: 1,
    },
  };
}

export const api = {
  health: () => request<{ status: string }>('/health', { auth: false }),
  auth: {
    register: (body: { email: string; name: string; password: string }) =>
      request<AuthPayload>('/auth/register', {
        auth: false,
        body,
        method: 'POST',
      }),
    login: (body: { email: string; password: string }) =>
      request<AuthPayload>('/auth/login', {
        auth: false,
        body,
        method: 'POST',
      }),
    refresh: (token: string) =>
      request<AuthPayload>('/auth/refresh', {
        auth: false,
        body: { refreshToken: token },
        method: 'POST',
      }),
    logout: (token: string) =>
      request<{ loggedOut: boolean }>('/auth/logout', {
        auth: false,
        body: { refreshToken: token },
        method: 'POST',
      }),
    me: () => request<ApiUser>('/auth/me'),
  },
  users: {
    me: () => request<ApiUser>('/users/me'),
    updateMe: (body: { avatarUrl?: string | null; name?: string }) =>
      request<ApiUser>('/users/me', { body, method: 'PATCH' }),
  },
  decks: {
    create: (body: {
      description?: string | null;
      tags?: string[];
      title: string;
      visibility: DeckVisibility;
    }) => request<DeckSummary>('/decks', { body, method: 'POST' }),
    list: () => request<DeckSummary[]>('/decks'),
    get: (deckId: string) => request<DeckDetail>(`/decks/${deckId}`),
    update: (
      deckId: string,
      body: {
        description?: string | null;
        tags?: string[];
        title?: string;
        visibility?: DeckVisibility;
      },
    ) => request<DeckDetail>(`/decks/${deckId}`, { body, method: 'PATCH' }),
    archive: (deckId: string) =>
      request<{ archived: boolean }>(`/decks/${deckId}`, { method: 'DELETE' }),
  },
  cards: {
    create: (
      deckId: string,
      body: {
        back: string;
        difficulty: CardDifficulty;
        explanation?: string | null;
        front: string;
        imageAlt?: string | null;
        imageUrl?: string | null;
        position: number;
      },
    ) => request<Card>(`/decks/${deckId}/cards`, { body, method: 'POST' }),
    listByDeck: (deckId: string) => request<Card[]>(`/decks/${deckId}/cards`),
    get: (cardId: string) => request<Card>(`/cards/${cardId}`),
    update: (
      cardId: string,
      body: {
        back?: string;
        difficulty?: CardDifficulty;
        explanation?: string | null;
        front?: string;
        imageAlt?: string | null;
        imageUrl?: string | null;
        position?: number;
      },
    ) => request<Card>(`/cards/${cardId}`, { body, method: 'PATCH' }),
    archive: (cardId: string) =>
      request<{ archived: boolean }>(`/cards/${cardId}`, { method: 'DELETE' }),
  },
  community: {
    list: (query?: {
      limit?: number;
      page?: number;
      search?: string;
      sort?: 'popular' | 'recent';
      tag?: string;
    }) => requestList<CommunityDeckSummary>('/community/decks', { query }),
    get: (deckId: string) =>
      request<CommunityDeckDetail>(`/community/decks/${deckId}`),
    save: (deckId: string) =>
      request<{ saved: true }>(`/community/decks/${deckId}/save`, {
        method: 'POST',
      }),
    unsave: (deckId: string) =>
      request<{ saved: false }>(`/community/decks/${deckId}/save`, {
        method: 'DELETE',
      }),
    fork: (deckId: string) =>
      request<{
        cardCount: number;
        description: string | null;
        forkedFromDeckId: string | null;
        id: string;
        ownerId: string;
        title: string;
        visibility: DeckVisibility;
      }>(`/community/decks/${deckId}/fork`, { method: 'POST' }),
  },
  study: {
    start: (deckId: string) =>
      request<{ initialized: number; totalCards: number }>(
        `/study/decks/${deckId}/start`,
        { method: 'POST' },
      ),
    due: (deckId: string, limit = 20) =>
      request<DueCard[]>(`/study/decks/${deckId}/due`, { query: { limit } }),
    review: (cardId: string, result: ReviewResult) =>
      request<{
        cardId: string;
        dueAt: string;
        nextBox: number;
        previousBox: number;
        progress: unknown;
        result: ReviewResult;
        reviewLogId: string;
      }>(`/study/cards/${cardId}/review`, { body: { result }, method: 'POST' }),
    stats: (deckId: string) =>
      request<StudyStats>(`/study/decks/${deckId}/stats`),
  },
  tags: {
    list: (search?: string) =>
      request<Tag[]>('/tags', { auth: false, query: { search } }),
  },
};

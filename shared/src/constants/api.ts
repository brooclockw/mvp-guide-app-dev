export const API_ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    ME: "/api/auth/me",
    RESET_PASSWORD: "/api/auth/reset-password",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  // Dashboard routes
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
    SALES_CHART: "/api/dashboard/sales-chart",
    RECENT_ACTIVITY: "/api/dashboard/recent-activity",
  },
  // Health check
  HEALTH: "/api/health",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

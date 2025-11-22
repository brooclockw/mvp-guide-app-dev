export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "user_registered"
    | "order_created"
    | "payment_received"
    | "user_updated";
  description: string;
  timestamp: string;
  userId?: string;
}

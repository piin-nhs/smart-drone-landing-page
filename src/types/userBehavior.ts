export interface UserBehavior {
  _id?: string;
  sessionId: string;
  eventType: "click" | "scroll" | "pageview";
  eventData: {
    targetId?: string;
    targetText?: string;
    scrollPercent?: number;
    path?: string;
  };
  userAgent: string;
  ip?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type AppStatus = "sandbox" | "contracting" | "production";

export type DeveloperApp = {
  id: string;
  name: string;
  description: string;
  productSlugs: string[];
  status: AppStatus;
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export type CreateAppInput = {
  name: string;
  description: string;
  productSlugs: string[];
};

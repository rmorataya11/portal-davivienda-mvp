export type AppEnvironment = "sandbox" | "contracting" | "production";

export type AppRecordStatus = "active" | "revoked";

export type DeveloperApp = {
  id: string;
  developerId: string;
  name: string;
  description: string | null;
  apiProduct: string;
  environment: AppEnvironment;
  apigeeAppName: string | null;
  status: AppRecordStatus;
  dailyQuota: number;
  createdAt: string;
  consumerKey: string | null;
  expiresAt: string | null;
};

export type CreateAppInput = {
  name: string;
  description: string;
  apiProduct: string;
};

export type UpdateAppInput = {
  name?: string;
  description?: string | null;
};

export type CreatedAppResult = {
  app: DeveloperApp;
  consumerSecret: string;
};

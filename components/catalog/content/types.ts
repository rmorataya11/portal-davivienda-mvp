export type ApiEndpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  httpUrl: string;
  description: string;
  contentType: string;
  credentialsLabel: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    location: "query" | "body" | "header";
    description: string;
  }>;
  requestBody: string;
  responseStatus: string;
  responseBody: string;
};

export type ApiError = {
  code: string;
  title: string;
  description: string;
};

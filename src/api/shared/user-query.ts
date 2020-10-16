import { UserProperties } from "@models/user";

export type QueryParams = {
  page: string;
  perPage: string;
};

export type UserQueryParams = QueryParams &
  Partial<
    Omit<
      { [key in keyof UserProperties]: string | undefined },
      "id" | "password"
    >
  >;

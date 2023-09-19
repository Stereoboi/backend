export interface JwtPayload {
  user: {
    id: number;
    email: string;
  };
}

export type JwtDoneCallback = (error: any, user?: any) => void;

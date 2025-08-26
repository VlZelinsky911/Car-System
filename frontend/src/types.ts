export type User = {
  id: number;
  email: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Vehicle = {
  id: number;
  make: string;
  model: string;
  year?: number | null;
  userId: number;
  placeholder?: boolean;
  createdAt: string;
  updatedAt: string;
};

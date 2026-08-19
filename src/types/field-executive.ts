export type FieldExecutiveStatus = "ACTIVE" | "INACTIVE";

export interface DairyFieldExecutive {
  id: string;
  employeeId: string;
  fullName: string;
  mobile: string;
  email: string | null;
  profilePhotoUrl: string | null;
  assignedArea: string;
  address: string | null;
  status: FieldExecutiveStatus;
  farmersCount: number;
  todaysCollectionLiters: number;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFieldExecutiveInput {
  fullName: string;
  mobile: string;
  email?: string;
  assignedArea: string;
  address?: string;
  profilePhotoFile?: File | null;
  passwordMode: "GENERATE" | "TEMPORARY";
  temporaryPassword?: string;
}

export interface CreateFieldExecutiveResult {
  fieldExecutive: DairyFieldExecutive;
  loginId: string;
  temporaryPassword: string;
}

export interface FieldExecutiveListParams {
  search?: string;
  status?: FieldExecutiveStatus;
  area?: string;
  joinedAfter?: string;
  joinedBefore?: string;
  page?: number;
  pageSize?: number;
}

export interface FieldExecutiveListResult {
  items: DairyFieldExecutive[];
  total: number;
  page: number;
  pageSize: number;
}

import { ApiError } from "@/lib/auth/api-error";
import { session } from "@/lib/auth/session";
import type {
  CreateFieldExecutiveInput,
  CreateFieldExecutiveResult,
  DairyFieldExecutive,
  FieldExecutiveListParams,
  FieldExecutiveListResult,
} from "@/types/field-executive";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

function authHeaders(): HeadersInit {
  const token = session.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  init?: RequestInit & { rawBody?: boolean },
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.rawBody ? {} : { "Content-Type": "application/json" }),
        ...authHeaders(),
        ...init?.headers,
      },
    });
  } catch {
    throw ApiError.networkError();
  }

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function listFieldExecutives(
  params: FieldExecutiveListParams,
): Promise<FieldExecutiveListResult> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.area) query.set("area", params.area);
  if (params.joinedAfter) query.set("joinedAfter", params.joinedAfter);
  if (params.joinedBefore) query.set("joinedBefore", params.joinedBefore);
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 50));

  return request<FieldExecutiveListResult>(
    `/admin/field-executives/?${query.toString()}`,
  );
}

export async function listAreas(): Promise<string[]> {
  return request<string[]>("/admin/field-executives/areas/");
}

export async function getFieldExecutive(
  id: string,
): Promise<DairyFieldExecutive> {
  return request<DairyFieldExecutive>(`/admin/field-executives/${id}/`);
}

export async function createFieldExecutive(
  input: CreateFieldExecutiveInput,
): Promise<CreateFieldExecutiveResult> {
  const formData = new FormData();
  formData.set("fullName", input.fullName);
  formData.set("mobile", input.mobile);
  if (input.email) formData.set("email", input.email);
  formData.set("assignedArea", input.assignedArea);
  if (input.address) formData.set("address", input.address);
  if (input.profilePhotoFile) {
    formData.set("profilePhoto", input.profilePhotoFile);
  }
  formData.set("passwordMode", input.passwordMode);
  if (input.passwordMode === "TEMPORARY" && input.temporaryPassword) {
    formData.set("temporaryPassword", input.temporaryPassword);
  }

  return request<CreateFieldExecutiveResult>("/admin/field-executives/", {
    method: "POST",
    body: formData,
    rawBody: true,
  });
}

export async function activateFieldExecutive(
  id: string,
): Promise<DairyFieldExecutive> {
  return request<DairyFieldExecutive>(
    `/admin/field-executives/${id}/activate/`,
    { method: "POST" },
  );
}

export async function deactivateFieldExecutive(
  id: string,
): Promise<DairyFieldExecutive> {
  return request<DairyFieldExecutive>(
    `/admin/field-executives/${id}/deactivate/`,
    { method: "POST" },
  );
}

export async function resetFieldExecutivePassword(
  id: string,
): Promise<{ temporaryPassword: string }> {
  return request<{ temporaryPassword: string }>(
    `/admin/field-executives/${id}/reset-password/`,
    { method: "POST" },
  );
}

import { ApiError } from "@/lib/auth/api-error";
import type { LoginRequest, LoginResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw ApiError.networkError();
  }

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  return (await response.json()) as LoginResponse;
}

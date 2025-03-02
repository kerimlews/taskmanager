import config from "../config";

export async function get<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(`${config.BACKEND_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }
  return response.json();
}

export async function remove(url: string, token?: string): Promise<void> {
  const response = await fetch(`${config.BACKEND_URL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }
}

export async function put(url: string, data: any, token?: string): Promise<void> {
  const response = await fetch(`${config.BACKEND_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }
}

export async function post<T>(url: string, data: any, token?: string): Promise<T> {
  const response = await fetch(`${config.BACKEND_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST ${url} failed with status ${response.status}`);
  }
  return response.json();
}

import { readCookie } from "./readCookie.js";

export async function authCall(url, data) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ENDPOINT}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    const json = await response.json();
    const message = json.message;
    const code = response.status;
    
    return { message, code };

  } catch (error) {
    return { message: "Error de conexión. Intente de nuevo más tarde.", code: 503 };
  }
}

export async function getCall(url) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ENDPOINT}${url}`, {
      method: "GET",
      credentials: 'include',
      headers: {
        'x-access-token': readCookie("user"),
      }
    });
    const data = await response.json();
    const code = response.status;
    //data.code = code;

    return { data };

  } catch (error) {
    return { message: "Error de conexión. Intente de nuevo más tarde.", code: 503 };
  }
}
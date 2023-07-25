import type PocketBase from "pocketbase";

const API_URL = "https://pixel-perfect-api.deno.dev/api";
// const API_URL = "http://localhost:8000/api";

export async function processMessage(
  pb: PocketBase,
  chat_id: string,
  message: string,
) {
    const user_id = pb.authStore.model?.id;
    const apiPath = chat_id == "new" ? '' : `/${chat_id}`;
    const url = `${API_URL}/draw/${user_id}${apiPath}`;
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "message" : message,
                "token" : pb.authStore.token
            }),
        },
    );
    const data = await response.json();
    return data;
}

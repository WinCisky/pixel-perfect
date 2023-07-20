import type PocketBase from "pocketbase";

export function toggleTheme(theme: string) {
  if (theme === "dark") {
    theme = "light";
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    theme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
  }
  return theme;
}

export function getTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) return "dark";
  return "light";
}

export function checkLoginAndRedirect(pb: PocketBase, page: string) {
  if (!pb.authStore.isValid) {
    window.location.href = page;
  }
}

export async function getUserGithubImage(pb: PocketBase) {
  const user_id = pb.authStore.model?.id;
  if (user_id) {
    const record = await pb.collection("users").getOne(user_id);
    if (record) {
      const user_name = record.username;
      //get avatar from github api
      const response = await fetch(
        `https://api.github.com/users/${user_name}`,
      );
      const data = await response.json();
      return data.avatar_url;
    }
    return "";
  } else {
    return "";
  }
}

export function getImageFilePath(
  image: string,
  collection: string,
  record: string,
  thumb: boolean = false,
  width: number = 200,
  height: number = 200,
) {
  let url =
    `https://dev.opentrust.it/api/files/${collection}/${record}/${image}`;
  if (thumb) {
    url += `?thumb=true&width=${width}&height=${height}`;
  }
  return url;
}

import type { PageLoad } from "./$types";
import PocketBase from "pocketbase";
import { getImageFilePath } from "$lib";
import { getChatData, formatChatData } from "$lib/api";

export const load = (async () => {
  const pb = new PocketBase("https://dev.opentrust.it/");
  const resultListChats = await getChatData(pb, 1);
  // only get the id and image, fix the image url
  let chats = formatChatData(resultListChats);

  return { "chats": chats };
}) satisfies PageLoad;

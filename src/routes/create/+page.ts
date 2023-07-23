import type { PageLoad } from "./$types";
import PocketBase from "pocketbase";
import { getImageFilePath } from "$lib";
import { getChatData } from "$lib/api";

export const load = (async () => {
  const pb = new PocketBase("https://dev.opentrust.it/");
  const resultListChats = await getChatData(pb, 1);

  // only get the id and image, fix the image url
  let chats = resultListChats.items.map((item) => {
    return {
      id: item.id,
      image: getImageFilePath(
        item.last_ai_image,
        item.collectionId,
        item.id,
        true,
        200,
        200,
      ),
    };
  });

  return { "chats": chats };
}) satisfies PageLoad;

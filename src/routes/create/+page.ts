import type { PageLoad } from "./$types";
import PocketBase from "pocketbase";
import { getImageFilePath } from "$lib";

export const load = (async () => {
  const pb = new PocketBase("https://dev.opentrust.it/");
  const resultList = await pb.collection("pixel_chats").getList(1, 10, {
    sort: "-created",
  });

  // only get the id and image, fix the image url
  let items = resultList.items.map((item) => {
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

  return { "items": items };
}) satisfies PageLoad;

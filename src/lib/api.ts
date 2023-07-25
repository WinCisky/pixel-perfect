import type PocketBase from "pocketbase";
import { getImageFilePath } from "$lib";
import type { ListResult } from "pocketbase";

export interface ChatData {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: ChatItem[];
}

export interface ChatItem {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  user: string;
  ai_image: string;
  input_text: string;
  chat: string;
}

export interface ChatPreview {
    id: string;
    image: string;
}

export async function getChatData(
  pb: PocketBase,
  page: number,
): Promise<ListResult<ChatItem>> {
  return await pb.collection("pixel_chats").getList(page, 10, {
    sort: "-created",
  });
}

export async function getChatImages(pb: PocketBase, chat_id: string) {
  return await pb.collection("pixel_images").getFullList<ChatItem>({
    filter: `chat.id = "${chat_id}"`,
    sort: "-created",
  });
}

export function formatChatData(
  chatsPage: ListResult<ChatItem>,
): ChatPreview[] {
  let chats = chatsPage.items.map((item) => {
    return {
      id: item.id,
      image: getImageFilePath(
        item.ai_image,
        item.collectionId,
        item.id,
        true,
        200,
        200,
      ),
    };
  });
  return chats;
}

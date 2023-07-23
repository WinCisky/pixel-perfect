import type PocketBase from "pocketbase";

export interface ChatData {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
    items: ChatItem[]
}

export interface ChatItem {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
    user: string
    ai_image: string
    input_text: string
    chat: string
}

export async function getChatData(pb: PocketBase, page: number) {
    return await pb.collection("pixel_chats").getList(page, 10,{
        sort: "-created",
    });
}

export async function getChatImages(pb: PocketBase, chat_id: string) {
    return await pb.collection("pixel_images").getFullList<ChatItem>({
        filter: `chat.id = "${chat_id}"`,
        sort: "-created",
    });
}
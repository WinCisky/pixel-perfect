<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import PocketBase, { Record } from "pocketbase";
    import {
        toggleTheme,
        getTheme,
        checkLoginAndRedirect,
        getUserGithubImage,
    } from "$lib";
    import { getChatImages, getChatData, formatChatData } from "$lib/api";
    import type { ChatItem } from "$lib/api";
    import { processMessage } from "$lib/message";
    import Chat from "./Chat.svelte";
    const pb = new PocketBase("https://dev.opentrust.it/");
    export let data: PageData;
    let userImg = "images/avatar.svg";
    let theme = "light";
    let selectedChat = -1;
    let loading = false;
    let inputMessage = "";
    let tempMessage = "";
    let error = "";
    $: chats = data.chats ? data.chats : [];
    let chat = [] as ChatItem[];

    $: selectedChat, onChatChange();

    // console.log(pb.authStore);

    function onChatChange() {
        error = "";
        if (selectedChat >= 0) loading = true;
        chat = [] as ChatItem[];
        if (selectedChat >= 0) {
            getChatImages(pb, chats[selectedChat].id).then((res) => {
                chat = res;
                loading = false;
            });
        }
    }

    function sendMessage() {
        if (inputMessage.length == 0) return;
        const msg = inputMessage;
        inputMessage = "";
        tempMessage = msg;
        const process = processMessage(
            pb,
            selectedChat >= 0 ? chats[selectedChat].id : "new",
            msg
        );
        process.then(async (res) => {
            // console.log(res);
            if (res && res.error) {
                error = res.error;
            } else if (res) {
                if (res.chat) { // new conversation
                    const listChats = await getChatData(pb, 1);
                    const formattedChats = formatChatData(listChats);
                    data.chats = formattedChats;
                    // selectedChat = formattedChats.findIndex(
                    //     (c) => c.id == res.chat
                    // );
                    selectedChat = 0; // same thing
                }
                if (res.message) {
                    // new message
                }
            }
            tempMessage = "";
        });
    }

    onMount(async () => {
        checkLoginAndRedirect(pb, "login");
        theme = getTheme();
        userImg = await getUserGithubImage(pb);
    });
</script>

<!-- three columns -->
<div class="flex flex-col md:flex-row">
    <div
        class="md:fixed md:top-0 md:right-0 md:h-screen md:w-16 m-0 p-2
                flex md:flex-col relative h-12 w-full align-middle items-center
                bg-primary text-white shadow"
    >
        <a
            class="w-10 md:w-12 avatar flex justify-center border-2 border-base-100 rounded-full"
            href="settings"
        >
            <div class="w-full rounded-full">
                <img src={userImg} alt="avatar" />
            </div>
        </a>
        <!-- change theme button -->
        <button
            class="w-10 md:mx-auto h-[22px] ml-auto md:mb-4 md:mt-auto border-2 rounded-full border-base-100 relative"
            on:click={() => (theme = toggleTheme(theme))}
        >
            <span
                class="flex align-middle w-5 h-5 rounded-full p-[2px] bg-base-100
                        absolute top-1/2 left-1/2 -translate-y-1/2 transition-transform
                        {theme == 'light'
                    ? '-translate-x-full'
                    : '-translate-x-0'}"
            >
                <img
                    src="images/theme_{theme}.svg"
                    class="w-4 h-4"
                    alt="theme"
                />
            </span>
        </button>
    </div>
    <div class="w-full md:w-1/4 h-[calc(25vh-1.5rem)] md:h-screen">
        <div
            class="flex md:flex-col md:w-full h-full items-center gap-6 overflow-auto
                    pl-6 md:pl-0 md:pt-6"
        >
            <!-- plus -->
            <a
                class="w-10 h-10 min-w-[2.5rem] mx-4 md:mx-0 md:my-6 rounded-full bg-accent shadow-lg flex justify-center items-center"
                on:click={() => (selectedChat = -1)}
                href="create"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    class="stroke-base-100"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </a>
            {#each chats as conversation, i (conversation.id)}
                <div
                    class="w-32 min-w-[8rem] md:min-w-0 md:min-h-[8rem] md:max-w-[10rem] h-3/4 md:w-3/4 md:h-32
                        bg-base-300 rounded-lg shadow-lg flex justify-center items-center"
                    on:click={() => (selectedChat = i)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => {
                        if (e.key == "Enter") selectedChat = i;
                    }}
                >
                    <img
                        class="max-h-full p-2"
                        src={conversation.image}
                        alt="thumb"
                    />
                </div>
            {/each}
        </div>
    </div>
    <div
        class="w-full md:w-[calc(75%-4rem)] h-[calc(75vh-1.5rem)] md:h-screen
                flex flex-col-reverse gap-3 overflow-auto pb-3 px-3"
    >
        <div class="form-control w-full">
            <label class="input-group w-full justify-center">
                <textarea
                    rows="3"
                    placeholder="Image description"
                    class="textarea textarea-bordered textarea-sm w-full max-w-lg outline-none focus:outline-none leading-5"
                    bind:value={inputMessage}
                />
                <span>
                    <button class="btn" on:click={sendMessage}> Draw </button>
                </span>
            </label>
        </div>
        <Chat {chat} {loading} {tempMessage} {error} />
    </div>
</div>

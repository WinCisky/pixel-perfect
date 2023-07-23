<script lang="ts">
    import type { ChatItem } from "$lib/api";
    import { getImageFilePath } from "$lib";
    export let chat = [] as ChatItem[];
    export let loading = false;
    let downloading = false;

    function getMessageImage(message: ChatItem) {
        return getImageFilePath(
            message.ai_image,
            message.collectionId,
            message.id
        );
    }

    function download(url: string, filename: string) {
        if (downloading) return;
        downloading = true;
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                downloading = false;
            });
    }
</script>

{#if chat.length === 0 && !loading}
    <div class="w-full min-h-[20rem] rounded-2xl max-w-md mx-auto
                flex justify-center items-center p-4">
        <div class="text-center">
            <div class="text-2xl font-bold">No messages yet</div>
            <div class="">Send a message to start the conversation</div>
        </div>
    </div>
{:else if loading}
    <div class="w-full min-h-[20rem] rounded-2xl max-w-md mx-auto
                flex justify-center items-center p-4">
        <div class="text-center">
            <div class="text-2xl font-bold">Loading...</div>
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    </div>
{/if}

{#each chat as message, i (message.id)}
    {#if message.ai_image}
        <div class="chat chat-start">
            <div class="chat-header mb-1">
                Ai
                <time class="text-xs opacity-50">at 12:48</time>
            </div>
            <div class="chat-bubble bg-base-300 text-inherit shadow-sm">
                Image generated <br /> Click on the image to download it, or send
                a new message to edit or click on the plus icon to create a new image.
            </div>
        </div>

        <div
            class="w-full min-h-[20rem] rounded-2xl max-w-md mx-auto bg-base-300
                    flex justify-center items-center shadow-sm hover:shadow-xl transition-shadow"
            on:click={() => download(getMessageImage(message), message.input_text + ".png")}
            on:keydown={(e) => {
                if (e.key === "Enter") {
                    download(getMessageImage(message), message.input_text + ".png");
                }
            }}
            tabindex="0"
            role="button"
        >
            <img
                class="w-full h-full object-contain max-w-[256px] max-h-[256px]
                        { downloading ? 'cursor-wait opacity-50' : 'cursor-pointer' }"
                src={getMessageImage(message)}
                alt="ai image for {message.input_text}"
            />
        </div>
    {/if}

    <div class="chat chat-end">
        <div class="chat-header mb-1">
            You
            <time class="text-xs opacity-50">at 12:46</time>
        </div>
        <div class="chat-bubble bg-base-300 text-inherit shadow-sm">
            {message.input_text}
        </div>
    </div>
{/each}

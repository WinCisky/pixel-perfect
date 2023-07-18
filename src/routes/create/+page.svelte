<script lang="ts">
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    const pb = new PocketBase("https://dev.opentrust.it/");
    let userImg = "images/avatar.svg";

    let theme = "light";

    function toggleTheme() {
        if (theme === "dark") {
            theme = "light";
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            theme = "dark";
            document.documentElement.setAttribute("data-theme", "dark");
        }
    }

    onMount(async () => {
        // dark mode check
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            theme = "dark";
        }
        // login check
        if (!pb.authStore.isValid) {
            window.location.href = "login";
        }
        // get user
        const user_id = pb.authStore.model?.id;
        if (user_id) {
            const record = await pb.collection("users").getOne(user_id);
            if (record) {
                const user_name = record.username;
                //get avatar from github api
                const response = await fetch(
                    `https://api.github.com/users/${user_name}`
                );
                const data = await response.json();
                userImg = data.avatar_url;
            }
        }
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
            on:click={toggleTheme}
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
            {#each Array(10) as _, i}
                <div
                    class="w-32 min-w-[8rem] md:min-w-0 md:min-h-[8rem] md:max-w-[10rem] h-3/4 md:w-3/4 md:h-32
                        bg-base-300 rounded-lg shadow-lg"
                >
                    Card
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
                    placeholder="Image description"
                    class="textarea textarea-bordered textarea-sm w-full max-w-lg"
                />
                <span>
                    <button class="btn">Draw</button>
                </span>
            </label>
        </div>
        <div class="chat chat-end">
            <div class="chat-header mb-1">
                You
                <time class="text-xs opacity-50">at 12:46</time>
            </div>
            <div class="chat-bubble bg-base-300 text-inherit">
                You underestimate my power!
            </div>
        </div>
        <div class="chat chat-start">
            <div class="chat-header mb-1">
                Ai
                <time class="text-xs opacity-50">at 12:48</time>
            </div>
            <div class="chat-bubble bg-base-300 text-inherit">
                It's over Anakin, <br />I have the high ground.
            </div>
        </div>
    </div>
</div>

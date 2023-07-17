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
<div class="flex">
    <div
        class="fixed top-0 right-0 h-screen w-16 m-0 p-2
                flex flex-col last:mt-auto
                bg-primary text-white shadow"
    >
        <a
            class="avatar flex justify-center border-2 border-base-100 rounded-full"
            href="settings"
        >
            <div class="w-full rounded-full">
                <img src={userImg} alt="avatar" />
            </div>
        </a>
        <!-- change theme button -->
        <button
            class="w-10 mx-auto h-[22px] mb-4 mt-auto border-2 rounded-full border-base-100 relative"
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
</div>

<script lang="ts">
    import PocketBase from 'pocketbase';
    const pb = new PocketBase('https://dev.opentrust.it/');

    $: loggedIn = pb.authStore.isValid;
    
    async function authWithGithub() {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' });

        // after the above you can also access the auth data from the authStore
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model?.id);

        if (pb.authStore.isValid){
            window.location.href = 'create';
        }
    }

    async function logout() {
        // "logout" the last authenticated model
        pb.authStore.clear();
        // update logged in status
        loggedIn = pb.authStore.isValid;
    }
</script>

{#if !loggedIn}
    <button class="btn btn-primary" on:click={authWithGithub}>
        Login with Github
    </button>
{:else}
    <button class="btn btn-primary" on:click={logout}>
        Logout
    </button>
{/if}
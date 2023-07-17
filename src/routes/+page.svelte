<script lang="ts">
    import PocketBase from 'pocketbase';
    const pb = new PocketBase('https://dev.opentrust.it/');
    
    $: loggedIn = pb.authStore.isValid;

    (async () => {
        if (pb.authStore.isValid){
            const user_id = pb.authStore.model?.id;
            if (user_id){
                const record = await pb.collection('users').getOne(user_id);
                console.log(record.username);
            }
        }
    })();
</script>

<h1 class="text-green-400">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if !loggedIn}
    <a href="login" class="btn btn-primary">Login</a>
{:else}
    <a href="create" class="btn btn-primary">Create</a>
{/if}
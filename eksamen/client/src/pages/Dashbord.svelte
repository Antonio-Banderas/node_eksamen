<script>
    import { allPosts, BASE_URL, user, userFavorites } from "../store/global";
    import Post from "../components/DashboardPost.svelte";
    import NewPost from "../components/NewPost.svelte";
    import SelectedPost from "../components/SelectedPost.svelte";
    import { onMount } from "svelte";
    import DashboardPost from "../components/DashboardPost.svelte";

    // --- posts list --- //
    onMount(fetchPosts);
    async function fetchPosts() {
        const respone = await fetch($BASE_URL + "/posts/api/posts");
        const data = await respone.json();

        $allPosts = data.data;
    }

    //--- favorites --- //
    let open = false;
    let selectedPost = null;

    function togglePost(post) {
        selectedPost = post;
        open = !open;
    }

    async function fetchFavoritePost(uuid) {
        const response = await fetch($BASE_URL + "/posts/api/posts/" + uuid);
        const data = await response.json();
        togglePost(data.data);
    }
</script>

{#if $user}
<NewPost />
{/if} 

<section class="dashboard">
    <section class="posts-list">
        {#each $allPosts as post}
            <DashboardPost {post} />
        {/each}
    </section>

    {#if $user}
        <aside class="favorites-list">
            <aside class="box2">
                <p><b>Favorites ⭐</b></p>
                {#each $userFavorites as favorite}
                    <button
                        on:click={() => fetchFavoritePost(favorite.postUuid)}
                        >{favorite.postTitle}</button
                    >
                {/each}
            </aside>
        </aside>
    {/if}
</section>

{#if open}
    <SelectedPost post={selectedPost} onClose={() => (open = false)} />
{/if}

<style>
    .dashboard {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 0px 0px;
        grid-template-areas: ". posts-list favorites-list";
    }
    .posts-list {
        grid-area: posts-list;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .favorites-list {
        grid-area: favorites-list;
        margin-right: 55%;

        
    }

    .box2 {
        padding: 5px;

        top: 20px;
        position: sticky;
        margin: 20px;
        border: 1px solid black;
        width: 150px;

        display: flex;
        flex-direction: column;

        border-radius: 20px;
        background-color: rgba(255, 255, 255, 0.753);
        border: 2px solid rgb(100, 89, 89);
        box-shadow: rgba(0, 0, 0, 0.151) 0px 5px 15px;
    }
</style>

<script>
    import FavoritePost from "./FavoritePost.svelte";
    import SelectedPost from "./SelectedPost.svelte";

    export let post;

    // --- OPEN/CLOSE POST --- //

    let open = false;
    let selectedPost = null;

    function togglePost(post) {
        selectedPost = post;
        open = !open;
    }
</script>

<!--------- POST DASHBOARD --------->

<article class="post">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="comments" on:click={() => togglePost(post)}>
        <p>💬 {post.comments.length} comments</p>
    </div>
    <div class="title"><b>{post.title}</b></div>
    
        <FavoritePost {post} />
    
    <div class="user">Posted by {post.user}</div>
    <div class="content">
        {#if post.postType === "text"}
            <p>{post.body}</p>
        {/if}
        {#if post.postType === "file"}
            {#if post.file.endsWith(".mp4")}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video
                    class="post-file"
                    controls
                    src={post.file}
                    width="100%"
                />
            {:else if post.file.endsWith(".mp3")}
                <audio class="post-file" controls src={post.file} />
            {:else}
                <!-- svelte-ignore a11y-missing-attribute -->
                <img class="post-file" src={post.file} />
            {/if}
        {/if}
        {#if post.postType === "link"}
            <p>{post.ogData.ogTitle}</p>
            <p>{post.ogData.ogDescription}</p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img class="post-og-img" src={post.ogData.ogImageUrl} />
        {/if}
    </div>
</article>

<!--------- SELECTED POST --------->

{#if open}
    <!-- <SelectedPost post={selectedPost} onClose={close} /> -->
    <SelectedPost post={selectedPost} onClose={() => (open = false)} />
{/if}

<style>
    .post {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 0.6fr 0.6fr 2.2fr 0.6fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas:
            "user user user"
            "title title title"
            "content content content"
            "comments comments favorite";

        height: 300px;
        width: 400px;
        border-radius: 20px;
        background-color: rgba(255, 255, 255, 0.753);
        border: 2px solid rgb(100, 89, 89);
        margin: 20px;
        box-shadow: rgba(0, 0, 0, 0.151) 0px 5px 15px;
    }

    .title {
        font-size: 18px;
        padding-top: 12px;
        grid-area: title;
        display: flex;
        border: 1px solid black;
        justify-content: center;
    }

    .comments {
        grid-area: comments;
        padding-left: 55px;
        border-top: 1px solid black;
        border-right: 1px solid black;
    }
    .comments:hover{
        background-color: rgb(81, 81, 228);
        border-bottom-left-radius: 15px;
    }

    .favorite {
        grid-area: favorite;
        border-top: 1px solid black;
        border-left: 1px solid black;

    }
    .favorite:hover{
        background-color: gold;
        border-bottom-right-radius: 15px;
    }

    .user {
        padding-top: 10px;
        padding-left: 15px;
        grid-area: user;
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
        text-align: left;

        border: 1px solid black;
    }


    .content {
        grid-area: content;
        border: 1px solid black;
        overflow: hidden;
    }
    .post-og-img {
        height: 100px;
    }
    .post-file {
        width: 100%;
    }
</style>

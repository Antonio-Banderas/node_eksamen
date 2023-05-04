<script>
    import { fade, fly } from "svelte/transition";
    import NewComment from "./NewComment.svelte";
    import { user } from "../store/global";

    export let post;
    export let onClose;

    const selectedPost = post;

    function close() {
        onClose();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="background" on:click={close} transition:fade />

<div class="box" transition:fly={{ y: -700 }}>
    <p><b>{selectedPost.title}</b></p>

    <!-- text  -->
    {#if selectedPost.postType === "text"}
        <p>{selectedPost.body}</p>
    {/if}

    <!-- img/audio/video  -->
    {#if selectedPost.postType === "file"}
        {#if selectedPost.file.endsWith(".mp4")}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video controls src={selectedPost.file} width="100%" />
        {:else if selectedPost.file.endsWith(".mp3")}
            <audio controls src={selectedPost.file} />
        {:else}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={selectedPost.file} width="100%" />
        {/if}
    {/if}

    <!-- link -->
    {#if selectedPost.postType === "link"}
        <a class="og-href" href={selectedPost.ogData.ogUrl} target="_blank" rel="noreferrer">
            <div class="og-post">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img class="og-image" src={selectedPost.ogData.ogImageUrl} />
                <p class="og-title">{selectedPost.ogData.ogTitle}</p>
                <p class="og-description">
                    {selectedPost.ogData.ogDescription}
                </p>
            </div>
        </a>
    {/if}
    <p>Posted by {selectedPost.user}</p>

    <hr />

    {#if $user}
        <NewComment
            {post}
            on:newComment={(event) =>(selectedPost.comments = [...selectedPost.comments,event.detail,])}
        />
    {/if}

    <hr />

    {#if selectedPost.comments != null}
        {#each selectedPost.comments as comment}
            <p>{comment.body} - {comment.user}</p>
        {/each}
    {:else}
        <p>no comments :(</p>
    {/if}
</div>

<style>
    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.801);
        z-index: 1;
    }

    /****/
    .box {
        align-self: center;
        z-index: 2;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;

        text-align: left;

        padding: 16px;
        border-radius: 8px;
        border: 1px solid #f6f7f8;
        background-color: #ffffff;
        box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
    }

    /* SelectedPost - Open Graph Post*/

    .og-href {
        text-decoration: none;
    }
    .og-post {
        border: 1px solid black;
        background-color: rgba(70, 131, 180, 0.623);
    }
    .og-title {
        font-weight: bold;
        color: black;
    }
    .og-description {
        font-size: small;
        color: black;


    }
    .og-image {
        width: 100%;
    }
</style>

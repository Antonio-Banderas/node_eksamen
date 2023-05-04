<script>
    import { fly, fade } from "svelte/transition";
    import { BASE_URL, user, allPosts } from "../store/global";

    let open = false;

    // --- NEW POST --- //
    let postType;
    let title;
    let body;
    let file;
    let link;

    async function submitNewPost() {
        const formData = new FormData();
        formData.append("postType", postType);
        formData.append("title", title);
        formData.append("body", body);
        formData.append("user", $user);
        formData.append("file", file);
        formData.append("link", link);

        await fetch($BASE_URL + "/posts/api/posts", {
            method: "POST",
            body: formData,
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    $allPosts.push({
                        postType: data.postType,
                        uuid: data.uniqueID,
                        title: data.title,
                        body: data.body,
                        user: data.user,
                        ogData: data.ogData,
                        file: data.file,
                        comments: data.comments,
                        likes: data.likes,
                    });
                    $allPosts = $allPosts;
                    open = false;
                });
            } else {
                alert("Error new post!");
            }
        });
    }
</script>

<div class="button-container">
    <button class="new-post-button" on:click={() => (open = !open)}
        >New Post 📑</button
    >
</div>
{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="background" on:click={() => (open = false)} transition:fade />

    <div class="box" transition:fly={{ y: +700 }}>
        {#if $user}
            <h3>Submit new post:</h3>

            <!-- post type -->
            <label>
                Post Type:
                <select bind:value={postType}>
                    <option value="text">Text</option>
                    <option value="link">Link</option>
                    <option value="file">File</option>
                </select>
            </label>
            <br />

            <!-- always title -->
            <input bind:value={title} type="text" placeholder="title" /><br />

            <!-- text -->
            {#if postType === "text"}
                <textarea
                    bind:value={body}
                    maxlength="300"
                    placeholder="Write your body"
                /><br />
            {/if}

            <!-- link -->
            {#if postType === "link"}
                <input bind:value={link} type="text" placeholder="link" />
            {/if}

            <!-- file -->
            {#if postType === "file"}
                <input
                    class="file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,video/mp4,audio/mpeg"
                    on:change={(event) => (file = event.target.files[0])}
                />
            {/if}

            <button on:click={submitNewPost}>Submit</button>
        {/if}
    </div>
{/if}

<style>
    button {
        display: flex;
        align-items: center;
        margin: 10px;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.801);
        z-index: 1;
    }
    .box {
        z-index: 2;
        position: fixed;
        top: 250px;
        left: 50%;
        transform: translateX(-50%);

        width: 250px;
        text-align: left;

        padding: 16px;
        border-radius: 8px;
        border: 1px solid #f6f7f8;
        background-color: #ffffff;
        box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
    }

    .new-post-button {
        border-radius: 10px;
        border: 2px solid black;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #f9f9f9;
        cursor: pointer;
        transition: border-color 0.25s;
        transition: border-color 0.25s;
    }

    .button-container {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
       
    }
</style>

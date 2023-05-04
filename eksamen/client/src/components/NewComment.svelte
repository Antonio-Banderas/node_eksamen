<script>
    import { BASE_URL, user } from "../store/global";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let post;

    let selectedPost = post;
    let body;

    async function submitNewComment(uuid) {
        await fetch($BASE_URL + "/comments/api/comments/" + uuid, {
            method: "POST",
            body: JSON.stringify({ user: $user, body }),
            headers: { "content-type": "application/json" },
        }).then((response) => {
            if (response.ok) {
                const newComment = { body, user: $user };
                dispatch("newComment", newComment);
            } else {
                alert("Error posting comment!");
            }
        });
    }
</script>

<h6>submit new comment:</h6>
<input bind:value={body} type="text" placeholder="comment" />
<button on:click={() => submitNewComment(selectedPost.uuid)}> Submit </button>

<script>
    import { BASE_URL, user, userFavorites } from "../store/global";

    export let post;

    async function savePost(uuid, title) {
        await fetch($BASE_URL + "/users/api/users/" + $user, {
            method: "PATCH",
            body: JSON.stringify({ postUuid: uuid, postTitle: title }),
            headers: { "content-type": "application/json" },
        }).then((response) => {
            if (response.ok) {
                $userFavorites = [
                    ...$userFavorites,
                    { postUuid: uuid, postTitle: title },
                ];
            } else {
                alert("You cannot favorite the same post twice!");
            }
        });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="favorite" on:click={() => savePost(post.uuid, post.title)}>
    <p>⭐</p>
</div>

<style>

    .favorite p{
        margin: 0px;
        padding: 0px;
        padding-left: 38px;
        padding-top: 8px;

        font-size: 22px
    }
    .favorite {
        grid-area: favorite;
        border-top: 1px solid black;
        border-left: 1px solid black;
    }
    .favorite:hover {
        background-color: gold;
        border-bottom-right-radius: 15px;
    }
</style>

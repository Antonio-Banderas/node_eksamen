<script>
    import { user } from "../store/global";
    import { onDestroy } from "svelte";
    import io from "socket.io-client";

    const socket = io("http://localhost:8080");

    // ---- USERS ---- //

    // connected users
    let connectedUsers = [];

    socket.on("share-connected-users", (data) => {
        connectedUsers = data;
    });

    // user connects
    socket.on("user-connected", () => {
        socket.emit("username-connected", $user);
    });

    // user disconnects
    socket.on("user-disconnected", (data) => {
        const index = connectedUsers.indexOf(data);
        connectedUsers.splice(index, 1);

        connectedUsers = connectedUsers;
    });

    onDestroy(() => {
        socket.emit("disconnect-user", $user);
    });

    // ---- CHATROOM  ---- //

    // saved messages
    let chatComments = [];

    socket.on("persistent-messages", (data) => {
        chatComments = data.comments;
    });

    // new message
    let newMessage;

    function sendMessage() {
        let date = new Date();
        let time = date.toLocaleTimeString("da-DK", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        let username = $user;
        socket.emit("new-message", {
            body: newMessage,
            username: username,
            time: time,
        });
    }

    // recieve the new message
    socket.on("recieved-message", ({ message }) => {
        let body = message.body;
        let username = message.username;
        let time = message.time;
        chatComments = [...chatComments, { time, username, body }];
    });
</script>

<section class="chat-container">
    <section class="connect-users">
        <h4>connected users:</h4>
        {#each connectedUsers as user}
            <p>{user}</p>
        {/each}
    </section>

    <div class="chatbox">
        <ul class="messages">
            {#each chatComments as message}
                <li>{message.time} | {message.username}: {message.body}</li>
            {/each}
        </ul>
    </div>

    <div class="form">
        <input class="input" autocomplete="off" bind:value={newMessage} />
        <button on:click={sendMessage}>Send</button>
    </div>
</section>

<style>
    .chat-container {
        margin-top: 50px;
        display: grid;
        grid-template-columns: 1fr 0.25fr;
        grid-template-rows: 1fr 1.6fr 0.4fr;
        gap: 0px 0px;
        grid-template-areas:
            "chatbox  connect-users"
            "chatbox connect-users"
            "form form";

            background-color: rgba(255, 255, 255, 0.753);

        border: 2px solid black;
        border-radius: 15px;
        margin-left: 20%;
        margin-right: 20%;
    }

    .connect-users {
        grid-area: connect-users;
    }

    .chatbox {
        padding-top: 75px;
        height: 650px;
        grid-area: chatbox;
        display: grid;
        grid-template-rows: auto 3rem;
    }

    .messages {
        padding: 15px;
        text-align: left;
        grid-row-start: 1;
        grid-row-end: 2;
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    .form {
        padding: 0.25rem;
        display: flex;
        height: 3rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
        grid-area: form;
    }
    .input {
        background-color: rgba(60, 60, 236, 0.397);

        border: none;
        padding: 0 1rem;
        flex-grow: 1;
        border-radius: 2rem;
        margin: 0.25rem;
    }
    .input:focus {
        outline: none;
    }
    .form > button {
        background: #3d4ff8d7;
        border: none;
        padding: 0 1rem;
        margin: 0.25rem;
        border-radius: 3px;
        outline: none;
        color: #fff;
    }
</style>

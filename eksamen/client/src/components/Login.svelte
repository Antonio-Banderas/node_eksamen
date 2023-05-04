<script>
    import { fly, fade } from "svelte/transition";
    import { BASE_URL, user, userFavorites } from "../store/global";

    let open = false;

    // --- LOGIN --- //
    let email;
    let password;

    async function login() {
        const response = await fetch($BASE_URL + "/login/api/login", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "content-type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            $user = data.user;
            $userFavorites = data.userFavorites;
            open = false;
        } else {
            alert("Error login!");
        }
    }

    // --- LOGOUT --- //
    async function logout() {
        await fetch($BASE_URL + "/login/api/logout", {
            credentials: "include",
            method: "POST",
        }).then((response) => {
            if (response.ok) {
                $user = false;
                open = false;
            } else {
                alert("Error logout!");
            }
        });
    }
</script>

<button class="nav-login-button" on:click={() => (open = !open)}>🔑</button>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="background" on:click={() => (open = !open)} transition:fade />
    <div class="box" transition:fly={{ y: +700 }}>
        <h3>Login:</h3>
        <input bind:value={email} type="email" placeholder="Email" />
        <input
            bind:value={password}
            type="password"
            placeholder="Password"
        />
        <button on:click={login}> login </button>

        <button on:click={logout}> logout </button>
    </div>
{/if}

<style>
    .nav-login-button:hover {
        cursor: pointer;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(2, 3, 3, 0.671);
        z-index: 1;
    }
    .box {
        z-index: 2;
        position: fixed;
        top: 250px;
        left: 50%;
        transform: translateX(-50%);

        width: 300px;
        text-align: left;

        padding: 16px;
        border-radius: 8px;
        border: 1px solid #f6f7f8;
        background-color: #ffffff;
        box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
    }
</style>

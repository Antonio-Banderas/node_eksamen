<script>
  // @ts-nocheck

  // --- AUX --- //
  import { Router, Link, Route } from "svelte-navigator";
  import UserRoute from "./pages/PrivateRoute/UserRoute.svelte";

  import { allPosts, BASE_URL, user } from "./store/global.js";

  // --- COMPONENTS --- //
  import Login from "./components/Login.svelte";

  // --- PAGES --- //
  import Dashboard from "./pages/Dashbord.svelte";
  import Chatroom from "./pages/Chatroom.svelte";
</script>

<main />

<Router>
  <nav>
    <Link to="/">Dashboard</Link>
    <Link to="chat">Chat</Link>
    <Login />
    {#if !$user}
      <div class="not-logged-in">
        <p>Not logged in</p>
      </div>
    {/if}

    {#if $user}
      <div class="logged-in">
        <p>User: {$user}</p>
      </div>
    {/if}
  </nav>

  <Route path="/"><Dashboard /></Route>
  <UserRoute path="/chat"><Chatroom /></UserRoute>
</Router>

<style>
  nav {
    text-decoration: none;
    display: flex;
    justify-content: space-around;
    place-items: center;
    width: 350px;
    height: 34px;
    border: 1px solid rgb(119, 119, 119);
    border-radius: 10px;
    margin: 0 auto;
  }

  nav > * {
    text-decoration: none;
  }

  .not-logged-in {
    background-color: rgba(240, 66, 66, 0.555);
    height: 34px;
    border-radius: 10px;

  }


  .logged-in{
    height: 34px;

    background-color: rgba(55, 235, 55, 0.568);
  }
</style>

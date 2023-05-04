<script>
  import { Route } from "svelte-navigator";
  import PrivateUserGuard from "./PrivateUserGuard.svelte";

  export let path;
</script>

<Route {path} let:params let:location let:navigate>
  <PrivateUserGuard>
    <slot {params} {location} {navigate} />
  </PrivateUserGuard>
</Route>

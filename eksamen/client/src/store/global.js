import { readable, writable } from "svelte/store";

export const BASE_URL = readable("http://localhost:8080");

export const allPosts = writable([])
export const userFavorites = writable([])

export const user = writable()

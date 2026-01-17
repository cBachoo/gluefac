import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/",
  // css: {
  // 	preprocessorOptions: {
  // 		scss: {
  // 			silenceDeprecations: [
  // 				"import",
  // 				"mixed-decls",
  // 				"color-functions",
  // 				"global-builtin",
  // 			],
  // 		},
  // 	},
  // },
});

// Rendered for the modal slot whenever no interceptor matches — an initial
// load, a refresh, or a direct visit. Next 16 requires every parallel-route
// slot to define this; the build fails without it.
export default function Default() {
  return null;
}

// The slot's match for "/" itself. A slot keeps its last active state across
// client-side navigation, so without a route that renders nothing the sheet
// would stay on screen after navigating away from it.
export default function ModalSlotRoot() {
  return null;
}

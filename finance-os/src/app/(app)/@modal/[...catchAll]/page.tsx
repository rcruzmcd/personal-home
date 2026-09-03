// Closes the sheet on any client-side navigation the interceptors don't match
// — including the redirect a form action performs after a successful save.
// Without this the slot keeps rendering its last match and the sheet survives.
export default function ModalSlotCatchAll() {
  return null;
}

/**
 * Progressive enhancement for the email signup. Without JavaScript the form
 * posts straight to the provider. With it, we submit in the background, keep
 * the visitor on the page, and report a signup.
 *
 * The provider's response is opaque to us (cross-origin, no-cors), so a
 * "success" means the request went out; the provider's double opt-in email is
 * what confirms the address.
 */
document
  .querySelectorAll<HTMLFormElement>("form[data-email-signup]")
  .forEach((form) => {
    form.addEventListener("submit", async (event) => {
      // Until a provider is configured the action isn't a URL; let the browser handle it.
      if (!/^https?:\/\//.test(form.action)) return;
      event.preventDefault();

      const button = form.querySelector("button");
      if (button) button.disabled = true;
      try {
        await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          mode: "no-cors",
        });
      } catch {
        // Offline or blocked: fall back to a normal submit.
        if (button) button.disabled = false;
        form.submit();
        return;
      }

      document.dispatchEvent(
        new CustomEvent("syracuse:track", { detail: { name: "email_signup" } })
      );
      const done = document.createElement("p");
      done.setAttribute("role", "status");
      done.className = "mt-3 text-base font-bold";
      done.textContent = "Thanks. Check your email to confirm your address.";
      form.replaceChildren(done);
    });
  });

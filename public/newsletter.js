// Newsletter sign-up forms. Any <form data-newsletter="<list>"> on the page posts to the
// newsletter Worker (enigma-newsletter-worker), which emails a confirmation link; nothing
// is subscribed until the reader clicks it. The same file serves digitalcustody.academy
// and enigma.sh; the list comes from the form.
//
// Cloudflare Turnstile loads only once someone focuses a form, so a page view alone
// contacts no third party. Events are delegated from document, so forms rendered later
// (by React) work without registering them.
//
// Markup (classes are styled by the site):
//   <form class="nl" data-newsletter="dca" novalidate>
//     <input type="email" name="email" required>
//     <button type="submit">Subscribe</button>
//     <label class="nl__hp">Website <input name="website" tabindex="-1" autocomplete="off"></label>
//     <div class="nl__challenge"></div>
//     <p class="nl__status" role="status" aria-live="polite"></p>
//   </form>
(() => {
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  // Locally: the Worker's dev server and Turnstile's always-pass test key.
  const ENDPOINT = LOCAL ? "http://localhost:8795/subscribe" : "https://newsletter.enigmahq.sh/subscribe";
  const SITEKEY = LOCAL ? "1x00000000000000000000AA" : "0x4AAAAAAFmlRZ5I0s6KJEWy";
  const EMAIL_RE = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[A-Za-z]{2,}$/;

  const MESSAGES = {
    sent: "Almost done. Check your inbox for a link to confirm your subscription.",
    email: "Enter a valid email address.",
    challenge: "The security check did not complete. Try again.",
    rate: "Too many attempts. Wait a minute and try again.",
    error: "Something went wrong. Try again in a few minutes.",
  };

  let turnstile = null;
  function loadTurnstile() {
    turnstile ??= new Promise((resolve, reject) => {
      window.__nlTurnstileReady = () => resolve(window.turnstile);
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__nlTurnstileReady";
      s.async = true;
      s.onerror = () => {
        turnstile = null;
        reject(new Error("turnstile"));
      };
      document.head.appendChild(s);
    });
    return turnstile;
  }

  // Per form: the widget id and a promise for its next token. A token is single-use,
  // so the widget is reset after every submission.
  const state = new WeakMap();

  function prepare(form) {
    if (state.has(form)) return state.get(form);
    const st = { widget: null, token: null, waiters: [] };
    state.set(form, st);
    loadTurnstile()
      .then((ts) => {
        st.widget = ts.render(form.querySelector(".nl__challenge"), {
          sitekey: SITEKEY,
          appearance: "interaction-only",
          action: "subscribe",
          callback: (t) => {
            st.token = t;
            st.waiters.splice(0).forEach((w) => w(t));
          },
          "expired-callback": () => (st.token = null),
          "error-callback": () => {
            st.token = null;
            st.waiters.splice(0).forEach((w) => w(null));
          },
        });
      })
      .catch(() => st.waiters.splice(0).forEach((w) => w(null)));
    return st;
  }

  function token(st) {
    if (st.token) return Promise.resolve(st.token);
    return new Promise((resolve) => {
      st.waiters.push(resolve);
      setTimeout(() => resolve(null), 30000);
    });
  }

  function show(form, kind, text) {
    const out = form.querySelector(".nl__status");
    out.textContent = text;
    out.dataset.kind = kind;
  }

  document.addEventListener("focusin", (e) => {
    const form = e.target instanceof Element && e.target.closest("form[data-newsletter]");
    if (form) prepare(form);
  });

  document.addEventListener("submit", async (e) => {
    const form = e.target instanceof Element && e.target.closest("form[data-newsletter]");
    if (!form) return;
    e.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return;
    const email = form.elements.email.value.trim();
    if (!EMAIL_RE.test(email)) {
      show(form, "error", MESSAGES.email);
      form.elements.email.focus();
      return;
    }
    const st = prepare(form);
    button.disabled = true;
    show(form, "busy", "Sending…");
    try {
      const t = await token(st);
      if (!t) return show(form, "error", MESSAGES.challenge);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          list: form.dataset.newsletter,
          turnstile: t,
          website: form.elements.website?.value ?? "",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        show(form, "ok", MESSAGES.sent);
      } else {
        show(form, "error", MESSAGES[body.error] ?? MESSAGES.error);
      }
    } catch {
      show(form, "error", MESSAGES.error);
    } finally {
      button.disabled = false;
      st.token = null;
      if (st.widget !== null) window.turnstile?.reset(st.widget);
    }
  });
})();

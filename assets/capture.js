/* capture.js — the ONE lead-capture handler for the whole site.

   HISTORY. On 2026-08-07 this file was written to end a real defect: the site
   posted leads to three endpoints, two of which 404'd, and six pages silently
   dropped every submission while showing the visitor nothing. The rule it
   established still holds and is the reason this rewrite is careful: NEVER show
   a confirmation you did not earn.

   2026-09-19 — REWRITTEN AT THE IDENTITY SPLIT.
   The endpoint this file used belonged to a different company's account and was
   still wired into every form on what is now the Mac Steel site. Left alone it
   would have delivered Mac Steel's leads into someone else's funnel: not a
   broken form, a misrouted one, which is worse because it looks like it works.
   (The retired endpoint is named in the repo history, not here — this file is
   served to visitors.)

   Mac Steel has no lead API of its own yet. Rather than invent an endpoint or
   point at something unverified, this hands the visitor off to a real inbox:
   their mail client opens with the message prefilled, and they can see it
   leave. Nothing is claimed to have been received that has not been.

   WHEN A REAL ENDPOINT EXISTS: set ENDPOINT below and the original POST path
   comes back — but only wire it to a worker on a Mac Steel account, and only
   after confirming it returns ok on a real submission. */

(function () {
  "use strict";

  // No Mac Steel lead endpoint yet. Empty means "hand off to email".
  var ENDPOINT = "";
  var INBOX = "macsmacpro@gmail.com";

  function note(form, text, ok) {
    var el = form.querySelector(".capture-msg");
    if (!el) {
      el = document.createElement("p");
      el.className = "capture-msg fine";
      form.appendChild(el);
    }
    el.textContent = text;
    el.setAttribute("role", "status");
    el.dataset.state = ok ? "ok" : "error";
  }

  function field(form, sel) {
    var el = form.querySelector(sel);
    return el && el.value ? String(el.value).trim() : "";
  }

  function collect(form) {
    return {
      name: field(form, 'input[name="name"]'),
      email: field(form, 'input[type="email"]'),
      website: field(form, 'input[name="website"]'),
      offer: field(form, 'select[name="offer"], input[name="offer"]'),
      message: field(form, 'textarea[name="message"]'),
      source: field(form, 'input[name="source"]') || location.pathname
    };
  }

  function mailtoFor(d) {
    var subject = d.offer ? ("Mac Steel — " + d.offer) : "Mac Steel — enquiry";
    var lines = [];
    if (d.name) { lines.push("Name: " + d.name); }
    if (d.email) { lines.push("Email: " + d.email); }
    if (d.website) { lines.push("Website: " + d.website); }
    if (d.offer) { lines.push("Interested in: " + d.offer); }
    if (d.message) { lines.push("", d.message); }
    lines.push("", "— sent from " + location.href);
    return "mailto:" + INBOX +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function wire(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = collect(form);
      if (!d.email) {
        note(form, "An email address is needed so there is somewhere to reply.", false);
        return;
      }

      if (!ENDPOINT) {
        // Opening the mail client is the whole delivery. Say exactly that —
        // "thanks, we'll be in touch" would be a claim about a message that has
        // not been sent yet and that only the visitor can send.
        window.location.href = mailtoFor(d);
        note(form,
          "Your email app should be opening with this ready to send. " +
          "If nothing happened, write to " + INBOX + " directly.", true);
        return;
      }

      var btn = form.querySelector("button");
      if (btn) { btn.disabled = true; }
      note(form, "Sending…", true);
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d)
      }).then(function (r) {
        if (!r.ok) { throw new Error("status " + r.status); }
        note(form, "Got it. You'll hear back at " + d.email + ".", true);
        form.reset();
      }).catch(function () {
        // The original rule: a failure tells the visitor how to reach a human,
        // it never swallows the lead behind a success message.
        note(form, "That did not go through. Please email " + INBOX + " instead.", false);
      }).then(function () {
        if (btn) { btn.disabled = false; }
      });
    });
  }

  function init() {
    var forms = document.querySelectorAll("form.capture, form[data-capture]");
    for (var i = 0; i < forms.length; i++) { wire(forms[i]); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());

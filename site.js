/* Behaviour shared by the pages that carry the nav and the contact form.
 *
 * index.html and timeline/index.html are hand-written static pages with no
 * template language, so this was two byte-identical copies of the same 64
 * lines kept in step by hand: _partials/ syncs their markup but has never
 * covered their JavaScript, and nothing failed the build when the two drifted.
 * This file is the one copy.
 *
 * Loaded with `defer`, so the document is parsed before any of it runs and
 * getElementById can be trusted at top level. Each block then bails out if its
 * element is absent — cv/ and meet-maxx/ carry neither the burger nor the
 * form, and adding this file to them has to stay harmless.
 */

(function () {
  // mobile menu — a disclosure. Routing every change through setMenu() keeps
  // aria-expanded from drifting out of step with the class, which is what it did
  // before: the menu opened but was always announced as collapsed.
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  // Escape hands focus back to the burger — without it a keyboard can only leave
  // the menu by tabbing through every link in it.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  // .burger is inside the 880px media query but .mobile-menu.open is not, so
  // widening past it would strand an open menu on screen with nothing to close it.
  window.matchMedia('(min-width:881px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
})();

(function () {
  // contact form → Web3Forms
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const note = document.getElementById('formNote');
    const btn = form.querySelector('button[type=submit]');

    // One place to set the result, so text and colour can never disagree. They
    // used to: the success wording sat in the markup and only the failure path
    // rewrote it, so a send that failed and then succeeded still read "something
    // went wrong" in red under a "Sent" button.
    // note is role="status", so unhide before writing — a live region has to be
    // exposed at the moment its text changes for the result to be announced.
    const FAILED = 'Something went wrong — please email maxx@maxxturing.com instead.';
    const SENT = 'Thanks — your message has been received and you\'ll hear back soon 👍';
    const showNote = (msg, ok) => {
      note.className = 'form-note mono ' + (ok ? 'is-ok' : 'is-err');
      note.hidden = false;
      note.textContent = msg;
    };

    btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json();
      if (data.success) {
        showNote(SENT, true);
        form.querySelectorAll('input,textarea').forEach(i => { if (i.type !== 'hidden' && i.type !== 'checkbox') i.value = ''; });
        btn.textContent = 'Sent \u2713';
      } else {
        showNote(FAILED, false);
        btn.textContent = 'Send message';
      }
    } catch (err) {
      showNote(FAILED, false);
      btn.textContent = 'Send message';
    }
  });
})();

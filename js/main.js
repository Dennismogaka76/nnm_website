// NNM Advocates — site interactions (plain JavaScript)
(function () {
  // Mobile menu
  var btn = document.querySelector('button[aria-controls="mobile-nav"]');
  var header = document.querySelector("header");
  var desk = document.querySelector('nav[aria-label="Main"]');
  if (btn && header && desk) {
    var nav = document.createElement("nav");
    nav.id = "mobile-nav";
    nav.setAttribute("aria-label", "Mobile");
    nav.className = "border-t bg-background lg:hidden";
    nav.hidden = true;
    var ul = document.createElement("ul");
    ul.className = "container-site flex flex-col py-4";
    desk.querySelectorAll("a").forEach(function (a) {
      var li = document.createElement("li");
      var l = document.createElement("a");
      l.href = a.getAttribute("href");
      l.textContent = a.textContent;
      l.className = "block border-b py-3 text-charcoal";
      li.appendChild(l);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    header.appendChild(nav);
    var openIcon = btn.innerHTML;
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    btn.addEventListener("click", function () {
      var open = nav.hidden;
      nav.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.innerHTML = open ? closeIcon : openIcon;
    });
  }

  // Insights filter + search
  var group = document.querySelector('[aria-label="Filter by category"]');
  var search = document.querySelector('input[type="search"]');
  if (group && search) {
    var grid = group.closest("section").querySelector(".grid");
    var cards = grid ? Array.prototype.slice.call(grid.children) : [];
    var cat = "All";
    var empty = document.createElement("p");
    empty.className = "mt-10 border bg-surface p-8 text-center text-muted-foreground";
    empty.textContent = "No articles match your search.";
    empty.hidden = true;
    grid && grid.after(empty);
    function apply() {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var t = c.textContent.toLowerCase();
        var ok = (cat === "All" || t.indexOf(cat.toLowerCase()) !== -1) && (!q || t.indexOf(q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    }
    group.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        cat = b.textContent.trim();
        group.querySelectorAll("button").forEach(function (x) {
          var on = x === b;
          x.setAttribute("aria-pressed", String(on));
          x.classList.toggle("btn-primary", on);
          x.classList.toggle("btn-outline", !on);
        });
        apply();
      });
    });
    search.addEventListener("input", apply);
  }

  // Contact form: preselect topic from ?topic= and show notice
  var form = document.querySelector("form");
  if (form) {
    var topic = new URLSearchParams(location.search).get("topic");
    var sel = form.querySelector('select[name="topic"]');
    if (topic && sel) sel.value = topic;
    form.addEventListener("submit", function (e) {
      // To send email from cPanel, set form action="contact.php" method="post" and remove this handler.
      e.preventDefault();
      if (form.querySelector('[role="status"]')) return;
      var p = document.createElement("p");
      p.setAttribute("role", "status");
      p.className = "mt-6 border-l-2 border-navy bg-background p-4 text-sm";
      p.innerHTML = 'Online submission is not yet active, so your message has <strong>not</strong> been sent. Please call us on <a href="tel:+254733783349" class="font-medium text-navy underline">0733 783 349</a>.';
      form.appendChild(p);
    });
  }
})();

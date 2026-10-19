/* =====================================================================
   CONTEÚDO EDITÁVEL – salve as imagens com EXATAMENTE estes nomes

   assets/icons/favicon.png
   assets/img/logo-oab-brusque.png
   assets/img/livro/livro-01.png … livro-04.png
   assets/img/historia/marco-01.jpg … marco-08.jpg
   assets/img/galeria/entrevistas/entrevista-01.jpg … entrevista-08.jpg
   assets/img/galeria/fotos/foto-01.jpg … foto-08.jpg
   assets/img/sobre/subsecao.jpg, equipe-01.jpg … equipe-03.jpg
   assets/img/publicacoes/publicacao-01.jpg … publicacao-03.jpg

   Enquanto uma imagem não existir, aparece uma caixa de exemplo no lugar.
   ===================================================================== */

// Imagens do livro (trocam a cada 2s). Para mais imagens, adicione linhas.
const BOOK_IMAGES = [
  "assets/img/livro/livro-01.png",
  "assets/img/livro/livro-02.png",
  "assets/img/livro/livro-03.png",
  "assets/img/livro/livro-04.png"
];
const BOOK_INTERVAL = 2000;

// Linha do tempo (8 marcos)
const MARCOS = Array.from({ length: 8 }, (_, i) => ({ ano: "[Ano]", titulo: "[Título do marco]", texto: "[Texto informativo sobre o que ocorreu neste ano.]", image: "assets/img/historia/marco-0" + (i + 1) + ".jpg" }));

// Entrevistas: youtube = link do vídeo; image = miniatura
const VIDEOS = Array.from({ length: 8 }, (_, i) => ({
  nome: "[Nome entrevistado]", ano: "[Ano]", youtube: "",
  image: "assets/img/galeria/entrevistas/entrevista-0" + (i + 1) + ".jpg", label: "[Vídeo " + (i + 1) + "]"
}));

// Fotos
const FOTOS = Array.from({ length: 8 }, (_, i) => ({
  legenda: "[Legenda e ano]",
  image: "assets/img/galeria/fotos/foto-0" + (i + 1) + ".jpg", label: "[Foto " + (i + 1) + "]"
}));

// E-mail que recebe as mensagens da página Contato (TROCAR)
const CONTACT_EMAIL = "email@exemplo.com.br";

/* ===================== código (não precisa editar) ===================== */
/* Este arquivo é usado por todas as páginas; cada bloco só roda se o elemento existir. */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const img = (src, alt, label) => `<img src="${esc(src)}" alt="${esc(alt)}" onerror="this.outerHTML='<span class=&quot;ph-fallback&quot;>${esc(label)}</span>'">`;

// Cabeçalho encolhe ao rolar
addEventListener("scroll", () => $(".site-head").classList.toggle("scrolled", scrollY > 40), { passive: true });

// Imagens das páginas internas (data-ph): se faltar o arquivo, mostra o texto de exemplo
document.querySelectorAll("img[data-ph]").forEach(i => {
  const swap = () => { const s = document.createElement("span"); s.className = "ph-fallback"; s.textContent = i.alt; i.replaceWith(s) };
  if (i.complete && !i.naturalWidth) swap(); else i.addEventListener("error", swap);
});

// Slider do livro (início)
if ($("#bookSlider")) (function () {
  const box = $("#bookSlider"), dots = $("#bookDots");
  BOOK_IMAGES.forEach((src, i) => {
    const s = document.createElement("div"); s.className = "slide" + (i ? "" : " on");
    s.innerHTML = img(src, "Imagem " + (i + 1) + " do livro", "[Imagem " + (i + 1) + " do livro]");
    box.insertBefore(s, dots);
    const d = document.createElement("button"); d.setAttribute("aria-label", "Imagem " + (i + 1));
    d.onclick = () => { go(i); restart() }; dots.appendChild(d);
  });
  const slides = [...box.querySelectorAll(".slide")], db = [...dots.children];
  let cur = 0, t;
  function go(n) { cur = (n + slides.length) % slides.length; slides.forEach((s, i) => s.classList.toggle("on", i === cur)); db.forEach((d, i) => d.setAttribute("aria-current", i === cur)) }
  function restart() { clearInterval(t); if (!matchMedia("(prefers-reduced-motion:reduce)").matches) t = setInterval(() => go(cur + 1), BOOK_INTERVAL) }
  go(0); restart();
})();

// Linha do tempo (início)
if ($("#timeline")) (function () {
  const ol = $("#timeline");
  MARCOS.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `<button class="pt" aria-label="${esc(m.ano)}: ${esc(m.titulo)}"></button><span class="yr">${esc(m.ano)}</span>
    <div class="card" role="tooltip"><div class="img">${img(m.image, m.titulo, "[Imagem do marco]")}</div><div class="t"><h3>${esc(m.titulo)}</h3>${esc(m.texto)}</div></div>`;
    li.querySelector(".pt").addEventListener("click", () => { const o = li.classList.contains("open"); ol.querySelectorAll(".open").forEach(x => x.classList.remove("open")); if (!o) li.classList.add("open") });
    ol.appendChild(li);
  });
  document.addEventListener("click", e => { if (!e.target.closest(".tl")) ol.querySelectorAll(".open").forEach(x => x.classList.remove("open")) });
})();

// Galeria (início)
if ($("#videos")) {
  $("#videos").innerHTML = VIDEOS.map(v => `<div class="item"><a class="ph" ${v.youtube ? `href="${esc(v.youtube)}" target="_blank" rel="noopener"` : ""}>${img(v.image, "Entrevista com " + v.nome, v.label)}</a><p><b>${esc(v.nome)}</b><br>${esc(v.ano)} - <a href="${esc(v.youtube || "#")}" target="_blank" rel="noopener">Assistir no YouTube</a></p></div>`).join("");
  $("#photos").innerHTML = FOTOS.map(f => `<div class="item"><div class="ph">${img(f.image, f.legenda, f.label)}</div><p><em>${esc(f.legenda)}</em></p></div>`).join("");
  document.querySelectorAll("[data-car]").forEach(c => {
    const tr = $(".track", c), l = $(".l", c), r = $(".r", c);
    const step = () => $(".item", tr).offsetWidth + 24;
    const upd = () => { l.disabled = tr.scrollLeft < 4; r.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4 };
    l.onclick = () => tr.scrollBy({ left: -step(), behavior: "smooth" });
    r.onclick = () => tr.scrollBy({ left: step(), behavior: "smooth" });
    tr.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  });
}

// Formulário de contato (página Contato): abre o e-mail do visitante com a mensagem pronta
if ($("#contactForm")) $("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const corpo = "Nome: " + f.get("nome") + "\nE-mail: " + f.get("email") + "\n\n" + f.get("mensagem");
  location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(f.get("assunto")) + "&body=" + encodeURIComponent(corpo);
});

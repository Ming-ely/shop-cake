// Tài khoản mặc định
const defaultUser = {
  username: "admin",
  email: "admin@gmail.com",
  password: "123456"
};

// Xử lý Đăng nhập
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (
      username === defaultUser.username &&
      password === defaultUser.password
    ) {
      alert("Đăng nhập thành công!");
      window.location.href = "home.html";
    } else {
      alert("Sai thông tin đăng nhập!");
    }
  });
}

// Xử lý Đăng ký
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (
      username === defaultUser.username &&
      email === defaultUser.email &&
      password === defaultUser.password
    ) {
      alert("Đăng ký thành công!");
      window.location.href = "home.html";
    } else {
      alert("Sai thông tin đăng ký! (Hãy nhập đúng thông tin mẫu)");
    }
  });
}
/* ------------------ CONFIG ------------------ */
const CATEGORIES = [
  "Bánh kem",
  "Bánh mousse",
  "Bánh cupcake",
  "Bánh tiramisu",
  "Khác"
];

const IMAGE_COUNT = 8; // project có images/cakes/cake1.jpg ... cake8.jpg
const IMAGES_PREFIX = "images/cakes/"; // theo cấu trúc của bạn

/* ------------------ HELPERS ------------------ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;

function getLocal(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback ?? null;
  try { return JSON.parse(raw); } catch { return fallback ?? null; }
}
function setLocal(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ------------------ INIT SAMPLE USERS & CAKES ------------------ */
function ensureInitialData() {
  if (!getLocal("users")) {
    const sample = [{
      username: "admin",
      email: "admin@gmail.com",
      password: "123456",
      createdAt: new Date().toISOString()
    }];
    setLocal("users", sample);
  }

  if (!getLocal("cakes")) {
    // tạo vài mẫu cake demo
    const demo = [
      { id: uid(), name: "Garden Swan – Bánh Bắp Thiên Nga Trái Cây", description: "Bánh bắp tươi thơm, điểm xuyến trái cây.", price: 475000, type: CATEGORIES[0], image: "cake4.jpg", creator: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: uid(), name: "Velvet Chocolate", description: "Chocolate đậm, lớp mousse mịn.", price: 360000, type: CATEGORIES[1], image: "cake2.jpg", creator: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: uid(), name: "Mini Cupcake Mix", description: "Set 6 cupcake vị khác nhau.", price: 120000, type: CATEGORIES[2], image: "cake3.jpg", creator: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: uid(), name: "Classic Tiramisu", description: "Biscoff & espresso, hương cà phê nồng nàn.", price: 400000, type: CATEGORIES[3], image: "cake1.jpg", creator: "admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    setLocal("cakes", demo);
  }
}
ensureInitialData();

/* ------------------ AUTH HANDLING (index.html compatibility) ------------------ */
const logiForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = (document.getElementById("username")?.value || "").trim();
    const password = (document.getElementById("password")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();

    const users = getLocal("users", []);
    const found = users.find(u => (u.username === username || u.email === email) && u.password === password);
    if (found) {
      // set current user
      const dto = { username: found.username, email: found.email, createdAt: found.createdAt };
      setLocal("currentUser", dto);
      alert("Đăng nhập thành công!");
      window.location.href = "home.html";
    } else {
      alert("Sai thông tin đăng nhập!");
    }
  });
}

/* Nếu có form đăng ký (register.html) hỗ trợ lưu user */
const registeForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = (document.getElementById("regUsername")?.value || "").trim();
    const email = (document.getElementById("regEmail")?.value || "").trim();
    const password = (document.getElementById("regPassword")?.value || "").trim();
    if (!username || !email || !password) { alert("Điền đủ thông tin nhé!"); return; }

    const users = getLocal("users", []);
    if (users.find(u => u.username === username || u.email === email)) {
      alert("Tên hoặc email đã tồn tại.");
      return;
    }
    const newUser = { username, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    setLocal("users", users);
    setLocal("currentUser", { username, email, createdAt: newUser.createdAt });
    alert("Đăng ký thành công! Bạn sẽ được chuyển vào trang chủ.");
    window.location.href = "home.html";
  });
}

/* ------------------ HOME PAGE LOGIC ------------------ */
const currentUser = () => getLocal("currentUser", null);

/* Elements on home */
const welcomeEl = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");
const emailInfo = document.getElementById("emailInfo");
const createdAtInfo = document.getElementById("createdAtInfo");
const cakesContainer = document.getElementById("cakesContainer");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnCreate = document.getElementById("btnCreate");
const btnMyCakes = document.getElementById("btnMyCakes");
const profilePanel = document.getElementById("profilePanel");

/* Modal & form */
const modalCreate = document.getElementById("modalCreate");
const cakeForm = document.getElementById("cakeForm");
const cakeName = document.getElementById("cakeName");
const cakeDesc = document.getElementById("cakeDesc");
const cakePrice = document.getElementById("cakePrice");
const cakeType = document.getElementById("cakeType");
const cakeImage = document.getElementById("cakeImage");
const cancelCreate = document.getElementById("cancelCreate");

const modalDetail = document.getElementById("modalDetail");
const detailBody = document.getElementById("detailBody");

let editingId = null;
let showOnlyMine = false;

/* Setup filters and image options */
function populateTypeSelects() {
  // Type filter (top)
  typeFilter.innerHTML = `<option value="">Tất cả loại</option>` + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
  // form select
  cakeType.innerHTML = `<option value="">-- Chọn loại bánh --</option>` + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
  // images
  let imgOptions = "";
  for (let i = 1; i <= IMAGE_COUNT; i++) {
    const path = `${IMAGES_PREFIX}cake${i}.jpg`;
    imgOptions += `<option value="${path}">cake${i}.jpg</option>`;
  }
  cakeImage.innerHTML = imgOptions;
}
populateTypeSelects();

/* UTIL: get cakes (with optional filters) */
function getAllCakes() {
  return getLocal("cakes", []);
}

/* RENDER CARDS */
function renderCakes(list) {
  if (!cakesContainer) return;
  cakesContainer.innerHTML = "";
  if (!list || list.length === 0) {
    cakesContainer.innerHTML = `<div style="grid-column:1/-1; padding:16px; color:#666">Không có sản phẩm nào.</div>`;
    return;
  }
  list.forEach(c => {
    const isMine = currentUser() && (currentUser().username === c.creator);
    const card = document.createElement("div");
    card.className = "cake-card";
    card.innerHTML = `
      <img src="${c.image}" alt="${escapeHtml(c.name)}">
      <div class="cake-body">
        <h4 class="cake-title">${escapeHtml(c.name)}</h4>
        <div class="cake-meta">${escapeHtml(c.type)} • ${formatPrice(c.price)}</div>
        <div style="height:46px; overflow:hidden; color:#444; margin-bottom:8px;">${escapeHtml(c.description || "")}</div>
        <div class="cake-actions">
          <button class="small detail" data-id="${c.id}">Chi tiết</button>
          ${isMine ? `<button class="small edit" data-id="${c.id}">Sửa</button><button class="small delete" data-id="${c.id}">Xóa</button>` : ""}
        </div>
      </div>
    `;
    cakesContainer.appendChild(card);
  });

  // attach events
  $$(".small.detail").forEach(b => b.onclick = (e) => viewCakeDetail(e.target.dataset.id));
  $$(".small.edit").forEach(b => b.onclick = (e) => openEditForm(e.target.dataset.id));
  $$(".small.delete").forEach(b => b.onclick = (e) => handleDelete(e.target.dataset.id));
}

/* Escape HTML to prevent injection in local display */
function escapeHtml(s="") {
  return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]) });
}

function formatPrice(n) {
  try { return n.toLocaleString('vi-VN') + " đ"; } catch { return n + " đ"; }
}

/* LOAD initial list based on filters */
function loadAndRender() {
  let cakes = getAllCakes();

  // apply filters
  const q = (searchInput?.value || "").trim().toLowerCase();
  const t = (typeFilter?.value || "");

  if (q) {
    cakes = cakes.filter(c => (
      (c.name || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q) ||
      (c.type || "").toLowerCase().includes(q)
    ));
  }
  if (t) cakes = cakes.filter(c => c.type === t);
  if (showOnlyMine && currentUser()) cakes = cakes.filter(c => c.creator === currentUser().username);

  // sort newest first
  cakes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  renderCakes(cakes);
}

/* EVENTS */
if (btnSearch) btnSearch.addEventListener("click", () => loadAndRender());
if (searchInput) searchInput.addEventListener("keyup", (e) => { if (e.key === "Enter") loadAndRender(); });

if (typeFilter) typeFilter.addEventListener("change", () => loadAndRender());

if (btnCreate) btnCreate.addEventListener("click", () => {
  if (!currentUser()) {
    alert("Bạn cần đăng nhập để tạo bánh.");
    window.location.href = "index.html";
    return;
  }
  editingId = null;
  openCreateModal();
});

if (btnMyCakes) btnMyCakes.addEventListener("click", () => {
  if (!currentUser()) {
    alert("Bạn cần đăng nhập để xem bánh của mình.");
    window.location.href = "index.html";
    return;
  }
  showOnlyMine = !showOnlyMine;
  btnMyCakes.textContent = showOnlyMine ? "Tất cả bánh" : "Bánh của tôi";
  loadAndRender();
});

/* Logout */
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Bạn đã đăng xuất.");
    window.location.href = "index.html";
  });
}

/* Show profile info */
function showProfile() {
  const u = currentUser();
  if (u) {
    welcomeEl.textContent = `Xin chào, ${u.username}`;
    emailInfo.textContent = u.email;
    createdAtInfo.textContent = new Date(u.createdAt).toLocaleString();
    profilePanel.style.display = "block";
  } else {
    welcomeEl.textContent = `Khách`;
    emailInfo.textContent = "-";
    createdAtInfo.textContent = "-";
    profilePanel.style.display = "none";
  }
}

/* Create / Edit modal open */
function openCreateModal() {
  modalCreate.classList.remove("hide");
  modalCreate.style.display = "flex";
  document.getElementById("modalTitle").textContent = editingId ? "Chỉnh sửa bánh" : "Tạo bánh mới";
  if (!editingId) {
    cakeForm.reset();
    cakeImage.value = `${IMAGES_PREFIX}cake1.jpg`;
    cakeType.value = CATEGORIES[0];
  } else {
    // fill with editing data
    const cake = getAllCakes().find(x => x.id === editingId);
    if (!cake) { alert("Không tìm thấy sản phẩm để sửa."); closeModalCreate(); return; }
    cakeName.value = cake.name;
    cakeDesc.value = cake.description;
    cakePrice.value = cake.price;
    cakeType.value = cake.type;
    cakeImage.value = cake.image;
  }
}

/* Close modal */
function closeModalCreate() {
  modalCreate.classList.add("hide");
  modalCreate.style.display = "none";
  editingId = null;
}

/* Cancel */
if (cancelCreate) cancelCreate.addEventListener("click", closeModalCreate);

/* Submit create/edit */
if (cakeForm) cakeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = (cakeName.value || "").trim();
  const desc = (cakeDesc.value || "").trim();
  const price = Number(cakePrice.value || 0);
  const type = cakeType.value;
  const image = cakeImage.value;

  if (!name || !type || isNaN(price)) { alert("Điền tên, loại và giá hợp lệ."); return; }
  if (!currentUser()) { alert("Bạn cần đăng nhập để thao tác."); window.location.href = "index.html"; return; }

  const cakes = getAllCakes();
  if (!editingId) {
    const newCake = {
      id: uid(),
      name, description: desc, price, type, image,
      creator: currentUser().username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    cakes.push(newCake);
    setLocal("cakes", cakes);
    alert("Tạo bánh thành công.");
  } else {
    const idx = cakes.findIndex(x => x.id === editingId);
    if (idx === -1) { alert("Không tìm thấy sản phẩm."); return; }
    // quyền: chỉ creator
    if (cakes[idx].creator !== currentUser().username) { alert("Bạn không có quyền sửa sản phẩm này."); return; }
    cakes[idx] = { ...cakes[idx], name, description: desc, price, type, image, updatedAt: new Date().toISOString() };
    setLocal("cakes", cakes);
    alert("Cập nhật sản phẩm thành công.");
  }
  closeModalCreate();
  loadAndRender();
});

/* Close modal when click outside */
window.addEventListener("click", (ev) => {
  if (ev.target === modalCreate) closeModalCreate();
  if (ev.target === modalDetail) closeModalDetail();
});

/* VIEW DETAIL */
function viewCakeDetail(id) {
  const cake = getAllCakes().find(c => c.id === id);
  if (!cake) { alert("Không tìm thấy sản phẩm."); return; }
  const isMine = currentUser() && currentUser().username === cake.creator;
  detailBody.innerHTML = `
    <div style="display:flex; gap:12px;">
      <img src="${cake.image}" style="width:260px; height:180px; object-fit:cover; border-radius:8px;">
      <div style="flex:1;">
        <h3>${escapeHtml(cake.name)}</h3>
        <div style="color:#666; margin-bottom:8px;">${escapeHtml(cake.type)} • ${formatPrice(cake.price)}</div>
        <div style="margin-bottom:12px;">${escapeHtml(cake.description || "")}</div>
        <div class="flex">
          ${isMine ? `<button class="btn" id="detailEdit">Sửa</button><button class="btn" id="detailDelete" style="background:#e74c3c">Xóa</button>` : ""}
          <button class="btn ghost right" id="detailClose">Đóng</button>
        </div>
      </div>
    </div>
  `;
  modalDetail.classList.remove("hide");
  modalDetail.style.display = "flex";

  // attach
  if (isMine) {
    const de = document.getElementById("detailEdit");
    const dd = document.getElementById("detailDelete");
    de.onclick = () => { editingId = id; closeModalDetail(); openCreateModal(); };
    dd.onclick = () => { if (confirm("Xóa sản phẩm này?")) { handleDelete(id); closeModalDetail(); } };
  }
  document.getElementById("detailClose").onclick = closeModalDetail;
}

function closeModalDetail() {
  modalDetail.classList.add("hide");
  modalDetail.style.display = "none";
}

/* Open edit by id (from card) */
function openEditForm(id) {
  if (!currentUser()) { alert("Bạn cần đăng nhập."); window.location.href = "index.html"; return; }
  const cake = getAllCakes().find(x => x.id === id);
  if (!cake) { alert("Không tìm thấy."); return; }
  if (cake.creator !== currentUser().username) { alert("Bạn không có quyền sửa."); return; }
  editingId = id;
  openCreateModal();
}

/* DELETE */
function handleDelete(id) {
  const cakes = getAllCakes();
  const idx = cakes.findIndex(x => x.id === id);
  if (idx === -1) { alert("Không tìm thấy."); return; }
  if (!currentUser()) { alert("Bạn cần đăng nhập."); window.location.href = "index.html"; return; }
  if (cakes[idx].creator !== currentUser().username) { alert("Bạn không có quyền xóa."); return; }
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  cakes.splice(idx, 1);
  setLocal("cakes", cakes);
  alert("Xóa thành công.");
  loadAndRender();
}

/* ------------------ BOOTSTRAP HOME ------------------ */
function boot() {
  // show profile
  showProfile();
  // populate dropdowns done earlier
  // initial render
  loadAndRender();
}
document.addEventListener("DOMContentLoaded", boot);

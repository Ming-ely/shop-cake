const API_URL = "http://banhngot.fitiluh.com/api/cakes";
const cakeList = document.getElementById("cake-list");
const searchBox = document.getElementById("searchBox");

// Hàm tải danh sách bánh
async function loadCakes(query = "") {
  try {
    let url = API_URL;
    if (query.trim() !== "") {
      url = `${API_URL}/search?keyword=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Lỗi tải dữ liệu");

    const data = await res.json();
    displayCakes(data);
  } catch (error) {
    cakeList.innerHTML = `<p style="color:red;text-align:center;">Không tải được danh sách bánh.</p>`;
    console.error(error);
  }
}

// Hàm hiển thị bánh
function displayCakes(cakes) {
  cakeList.innerHTML = "";
  if (cakes.length === 0) {
    cakeList.innerHTML = "<p style='text-align:center;'>Không tìm thấy bánh nào 😢</p>";
    return;
  }

  cakes.forEach(cake => {
    cakeList.innerHTML += `
      <div class="cake-item">
        <img src="${cake.image || 'https://via.placeholder.com/200x150?text=Banh'}" alt="${cake.name}">
        <h3>${cake.name}</h3>
        <p>${cake.price?.toLocaleString() || 0} đ</p>
        <p>${cake.description || ''}</p>
      </div>
    `;
  });
}

// Tìm kiếm bánh
searchBox.addEventListener("input", e => {
  const query = e.target.value;
  loadCakes(query);
});

// Gọi lần đầu khi trang mở
loadCakes();
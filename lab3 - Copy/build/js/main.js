"use strict";
const mainContent = document.getElementById("main-content");
const catalogLink = document.getElementById("catalog-link");
catalogLink.addEventListener("click", function (event) {
    event.preventDefault();
    loadCatalog();
});
async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Помилка завантаження файлу: " + url);
    }
    const data = await response.json();
    return data;
}
async function loadCatalog() {
    try {
        const categories = await loadJson("data/categories.json");
        showCatalog(categories);
    }
    catch (error) {
        showError("Не вдалося завантажити каталог.");
    }
}
function showCatalog(categories) {
    let html = `
    <section class="catalog-box">
      <h2>Каталог</h2>
      <p>Оберіть категорію товарів:</p>
      <ul class="category-list">
  `;
    categories.forEach(function (category) {
        html += `
      <li>
        <a href="#" data-category="${category.shortname}">
          ${category.name}
        </a>
      </li>
    `;
    });
    html += `
      <li>
        <a href="#" id="specials-link">Specials</a>
      </li>
    </ul>
    </section>
  `;
    mainContent.innerHTML = html;
    const categoryLinks = document.querySelectorAll("[data-category]");
    categoryLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const shortname = link.dataset.category;
            loadCategory(shortname);
        });
    });
    const specialsLink = document.getElementById("specials-link");
    specialsLink.addEventListener("click", function (event) {
        event.preventDefault();
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        loadCategory(randomCategory.shortname);
    });
}
async function loadCategory(shortname) {
    try {
        const categoryData = await loadJson("data/" + shortname + ".json");
        showCategory(categoryData);
    }
    catch (error) {
        showError("Не вдалося завантажити товари категорії.");
    }
}
function showCategory(categoryData) {
    let html = `
    <section class="category-box">
      <h2>${categoryData.categoryName}</h2>
      <div class="products-grid">
  `;
    categoryData.items.forEach(function (product) {
        html += `
      <article class="product-card">
        <img
          src="https://placehold.co/200x200?text=${product.shortname}"
          alt="${product.name}"
        >
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price} грн</p>
      </article>
    `;
    });
    html += `
      </div>
    </section>
  `;
    mainContent.innerHTML = html;
}
function showError(message) {
    mainContent.innerHTML = `
    <div class="error">
      ${message}
    </div>
  `;
}

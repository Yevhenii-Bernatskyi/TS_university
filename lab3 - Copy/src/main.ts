interface Category {
  id: number;
  name: string;
  shortname: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  shortname: string;
  description: string;
  price: number;
}

interface CategoryData {
  categoryName: string;
  items: Product[];
}

const mainContent = document.getElementById("main-content") as HTMLElement;
const catalogLink = document.getElementById("catalog-link") as HTMLAnchorElement;

catalogLink.addEventListener("click", function (event: MouseEvent): void {
  event.preventDefault();
  loadCatalog();
});

async function loadJson<T>(url: string): Promise<T> {
  const response: Response = await fetch(url);

  if (!response.ok) {
    throw new Error("Помилка завантаження файлу: " + url);
  }

  const data: T = await response.json();
  return data;
}

async function loadCatalog(): Promise<void> {
  try {
    const categories: Category[] = await loadJson<Category[]>("data/categories.json");
    showCatalog(categories);
  } catch (error) {
    showError("Не вдалося завантажити каталог.");
  }
}

function showCatalog(categories: Category[]): void {
  let html: string = `
    <section class="catalog-box">
      <h2>Каталог</h2>
      <p>Оберіть категорію товарів:</p>
      <ul class="category-list">
  `;

  categories.forEach(function (category: Category): void {
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

  const categoryLinks: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll("[data-category]");

  categoryLinks.forEach(function (link: HTMLAnchorElement): void {
    link.addEventListener("click", function (event: MouseEvent): void {
      event.preventDefault();

      const shortname: string = link.dataset.category as string;
      loadCategory(shortname);
    });
  });

  const specialsLink = document.getElementById("specials-link") as HTMLAnchorElement;

  specialsLink.addEventListener("click", function (event: MouseEvent): void {
    event.preventDefault();

    const randomIndex: number = Math.floor(Math.random() * categories.length);
    const randomCategory: Category = categories[randomIndex];

    loadCategory(randomCategory.shortname);
  });
}

async function loadCategory(shortname: string): Promise<void> {
  try {
    const categoryData: CategoryData =
      await loadJson<CategoryData>("data/" + shortname + ".json");

    showCategory(categoryData);
  } catch (error) {
    showError("Не вдалося завантажити товари категорії.");
  }
}

function showCategory(categoryData: CategoryData): void {
  let html: string = `
    <section class="category-box">
      <h2>${categoryData.categoryName}</h2>
      <div class="products-grid">
  `;

  categoryData.items.forEach(function (product: Product): void {
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

function showError(message: string): void {
  mainContent.innerHTML = `
    <div class="error">
      ${message}
    </div>
  `;
}
const NPOINT_URL = 'https://api.npoint.io/370c3dda4019b0689bde';
const LS_KEY     = 'pm_products';
const LS_ID_KEY  = 'pm_next_id';

const CATEGORIES = ['Computers', 'Electronics', 'Shoes', 'Bags', 'Furniture'];
const BRANDS     = ['Apple', 'Lenovo', 'Beats', 'Nike', 'Amazon', 'Diro', 'Arlime', 'The North Face', 'Sony', 'Adidas', 'Canon'];

function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProducts(products) {
  localStorage.setItem(LS_KEY, JSON.stringify(products));
}

function getNextId() {
  const stored = localStorage.getItem(LS_ID_KEY);
  return stored ? Number(stored) : null;
}

function setNextId(id) {
  localStorage.setItem(LS_ID_KEY, String(id));
}

async function ensureProducts() {
  const cached = loadProducts();
  if (cached) return cached;

  const res  = await fetch(NPOINT_URL);
  if (!res.ok) throw new Error('Failed to fetch seed data');
  const json = await res.json();
  const products = json.products;

  saveProducts(products);

  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
  setNextId(maxId + 1);

  return products;
}

export const api = {
  async getProducts({ search = '', category = '', brand = '', status = '', page = 1, limit = 8 } = {}) {
    const products = await ensureProducts();

    let filtered = products.filter(p => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.id) === q.replace('#', '');
      const matchCat    = !category || p.category === category;
      const matchBrand  = !brand    || p.brand === brand;
      const matchStatus = !status   || p.status === status;
      return matchSearch && matchCat && matchBrand && matchStatus;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async createProduct(data) {
    const products = await ensureProducts();

    let nextId = getNextId();
    if (nextId == null) {
      nextId = products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    }

    const product = {
      ...data,
      id: nextId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [product, ...products];
    saveProducts(updated);
    setNextId(nextId + 1);

    return product;
  },

  async updateProduct(id, data) {
    const products = await ensureProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    products[idx] = { ...products[idx], ...data };
    saveProducts(products);
    return products[idx];
  },

  async deleteProduct(id) {
    const products = await ensureProducts();
    saveProducts(products.filter(p => p.id !== id));
    return { success: true };
  },

  async deleteProducts(ids) {
    const products = await ensureProducts();
    saveProducts(products.filter(p => !ids.includes(p.id)));
    return { success: true };
  },

  getCategories() { return CATEGORIES; },
  getBrands()     { return BRANDS; },
};

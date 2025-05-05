/**
 * Product management module for handling product catalog and inventory
 */

/**
 * Represents a product in the catalog
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {number} stock - Available stock
 * @property {string[]} categories - Product categories
 */

/**
 * Product catalog with inventory management
 */
export class ProductCatalog {
    /**
     * @param {Product[]} products - Initial product list
     */
    constructor(products = []) {
        this.products = new Map(products.map(p => [p.id, p]));
    }

    /**
     * Adds a new product to the catalog
     * @param {Product} product - Product to add
     * @throws {Error} If product ID already exists
     */
    addProduct(product) {
        if (this.products.has(product.id)) {
            throw new Error(`Product with ID ${product.id} already exists`);
        }
        this.products.set(product.id, product);
    }

    /**
     * Updates an existing product
     * @param {string} id - Product ID
     * @param {Partial<Product>} updates - Product updates
     * @throws {Error} If product doesn't exist
     */
    updateProduct(id, updates) {
        const product = this.products.get(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        this.products.set(id, { ...product, ...updates });
    }

    /**
     * Removes a product from the catalog
     * @param {string} id - Product ID
     * @throws {Error} If product doesn't exist
     */
    removeProduct(id) {
        if (!this.products.has(id)) {
            throw new Error(`Product with ID ${id} not found`);
        }
        this.products.delete(id);
    }

    /**
     * Gets a product by ID
     * @param {string} id - Product ID
     * @returns {Product|undefined} Product if found
     */
    getProduct(id) {
        return this.products.get(id);
    }

    /**
     * Gets all products in a category
     * @param {string} category - Category name
     * @returns {Product[]} Products in category
     */
    getProductsByCategory(category) {
        return Array.from(this.products.values())
            .filter(p => p.categories.includes(category));
    }

    /**
     * Updates product stock
     * @param {string} id - Product ID
     * @param {number} quantity - Stock change (positive to add, negative to remove)
     * @throws {Error} If product doesn't exist or stock would go negative
     */
    updateStock(id, quantity) {
        const product = this.getProduct(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }

        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new Error(`Insufficient stock for product ${id}`);
        }

        this.updateProduct(id, { stock: newStock });
    }
} 
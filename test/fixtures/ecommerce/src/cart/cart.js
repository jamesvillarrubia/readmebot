/**
 * Shopping cart module for handling product additions, removals, and calculations
 */

/**
 * Represents a product in the shopping cart
 * @typedef {Object} CartItem
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {number} quantity - Quantity in cart
 */

/**
 * Represents the shopping cart state
 * @typedef {Object} Cart
 * @property {CartItem[]} items - Array of cart items
 * @property {number} total - Total cart value
 */

/**
 * Creates a new empty shopping cart
 * @returns {Cart} New cart instance
 */
export function createCart() {
    return {
        items: [],
        total: 0
    };
}

/**
 * Adds a product to the cart
 * @param {Cart} cart - Current cart state
 * @param {CartItem} item - Item to add
 * @returns {Cart} Updated cart
 * @throws {Error} If item quantity is invalid
 */
export function addToCart(cart, item) {
    if (item.quantity <= 0) {
        throw new Error('Invalid quantity: must be greater than 0');
    }

    const existingItem = cart.items.find(i => i.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.items.push({ ...item });
    }

    cart.total = calculateTotal(cart.items);
    return cart;
}

/**
 * Removes a product from the cart
 * @param {Cart} cart - Current cart state
 * @param {string} itemId - ID of item to remove
 * @returns {Cart} Updated cart
 */
export function removeFromCart(cart, itemId) {
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.total = calculateTotal(cart.items);
    return cart;
}

/**
 * Calculates the total value of cart items
 * @param {CartItem[]} items - Cart items
 * @returns {number} Total value
 */
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
} 
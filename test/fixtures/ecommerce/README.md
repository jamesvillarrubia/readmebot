# E-commerce Test Project

This is a test project used to demonstrate the documentation generation capabilities of ReadmeBot. It implements a simple e-commerce system with the following components:

## Components

### Cart Module (`src/cart/cart.js`)

- Shopping cart functionality
- Add/remove items
- Calculate totals
- Handle quantity updates

### Product Catalog (`src/products/products.js`)

- Product management
- Inventory tracking
- Category organization
- Stock updates

## Business Rules

### Cart

- Items must have positive quantities
- Total is automatically recalculated on changes
- Duplicate items are merged with quantities added

### Products

- Each product must have a unique ID
- Stock cannot go negative
- Products can belong to multiple categories
- Price must be positive

## Integration Points

### Cart and Product Catalog

- Cart operations verify product existence
- Stock levels are checked when adding to cart
- Price consistency is maintained between systems

## Testing

This project serves as a test fixture for ReadmeBot's documentation generation capabilities. It demonstrates:

1. Project-level documentation
2. Module-level documentation
3. File-level documentation
4. Function-level documentation

The code includes JSDoc comments to test documentation extraction and business context analysis.

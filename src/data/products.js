export const products = [
  {
    id: 'henley-shirt',
    name: 'Henley Shirts',
    description: 'Classic buttoned placket in a relaxed, modern urban silhouette.',
    price: 1500,
    image: '/henley-product-hanger.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Stone'],
    in_stock: true,
  },
  {
    id: 'full-sleeve-shirt',
    name: 'Full Sleeve Shirts',
    description: 'Clean architectural lines in custom-dyed premium cotton.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Cream'],
    in_stock: true,
  },
  {
    id: 'essentials',
    name: 'Essentials',
    description: 'Everyday heavyweight foundational layers built to last.',
    price: 5800,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    in_stock: true,
  },
];

export const getProductById = (id) => products.find((product) => product.id === id);

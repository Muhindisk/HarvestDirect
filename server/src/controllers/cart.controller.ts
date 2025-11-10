import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get current user's cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// Add or increment an item
export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existing = cart.items.find(it => it.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Math.min(quantity, product.quantity),
        priceSnapshot: product.price,
        nameSnapshot: product.name,
        image: product.images?.[0],
      } as any);
    }

    await cart.save();
    const total = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

  // Mongoose's DocumentArray#id may not be available on the typed array here,
  // so locate the item by its _id string instead for TypeScript compatibility.
  // TS model typings may not surface the automatic _id on subdocuments, cast to any
  const item = cart.items.find((it: any) => it._id && it._id.toString() === (itemId as string));
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    // ensure not exceeding product stock
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    item.quantity = Math.min(Math.max(1, quantity), product.quantity);

    await cart.save();
    const total = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

  // Remove the item by filtering the items array to exclude the given itemId.
  cart.items = cart.items.filter((it: any) => !(it._id && it._id.toString() === itemId));
  await cart.save();

    const total = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};

// Merge a guest cart into user's cart
export const mergeCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { items } = req.body as { items: Array<{ productId: string; quantity: number }> };

    const existingCart = await Cart.findOne({ user: userId });
    let cart = existingCart || new Cart({ user: userId, items: [] });

    for (const it of items || []) {
      const product = await Product.findById(it.productId);
      if (!product) continue;

      const found = cart.items.find(ci => ci.product.toString() === it.productId);
      if (found) {
        found.quantity = Math.min(found.quantity + it.quantity, product.quantity);
      } else {
        cart.items.push({
          product: product._id,
          quantity: Math.min(it.quantity, product.quantity),
          priceSnapshot: product.price,
          nameSnapshot: product.name,
          image: product.images?.[0],
        } as any);
      }
    }

    await cart.save();
    const total = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0);
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to merge cart' });
  }
};

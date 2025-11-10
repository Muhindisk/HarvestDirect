import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Public routes
// Get all products with optional filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, limit = '50' } = req.query;
    
    const query: Record<string, unknown> = { status: 'available' };
    
    // Search by name or description
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filter by category
    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      query.category = category.toLowerCase();
    }
    
    // Build sort object
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'name') sortObj = { name: 1 };
    
    const products = await Product.find(query)
      .populate('farmer', 'name location rating')
      .sort(sortObj)
      .limit(parseInt(limit as string, 10));
    
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get farmer's own products (protected route)
router.get('/my-products', protect, authorize('farmer'), async (req: AuthRequest, res) => {
  try {
    const farmerId = req.user!._id;
    const products = await Product.find({ farmer: farmerId }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email location rating');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Protected routes (farmers only)
// Create a new product
router.post('/', protect, authorize('farmer'), async (req: AuthRequest, res) => {
  try {
    const farmerId = req.user!._id;
    const { name, description, category, price, unit, quantity, images, location, harvestDate, organic, certified } = req.body;
    
    if (!name || !description || !category || price === undefined || !unit || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields: name, description, category, price, unit, quantity' });
    }
    
    const product = new Product({
      name,
      description,
      category: category.toLowerCase(),
      price,
      unit,
      quantity,
      images: images || [],
      farmer: farmerId,
      location: location || {},
      harvestDate,
      organic: organic || false,
      certified: certified || false,
      status: 'available',
    });
    
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', protect, authorize('farmer'), async (req: AuthRequest, res) => {
  try {
    const farmerId = (req.user!._id as any).toString();
    const product = await Product.findById(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    const allowedUpdates = ['name', 'description', 'price', 'quantity', 'unit', 'category', 'images', 'location', 'harvestDate', 'organic', 'certified', 'status'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        (product as any)[key] = req.body[key];
      }
    });
    
    await product.save();
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', protect, authorize('farmer'), async (req: AuthRequest, res) => {
  try {
    const farmerId = (req.user!._id as any).toString();
    const product = await Product.findById(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;

import Product from '../models/product.model.js';
import imagekit from '../config/imagekit.config.js';

// Create Product (Seller only)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Product image is required',
      });
    }

    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`,
      folder: '/products',
    });

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      image: {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      },
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get All Products (Public, with optional category & search filter)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get Single Product by ID (Public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update Product (Seller only, must be owner)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own products',
      });
    }

    const { title, description, price, stock, category } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (category !== undefined) updateData.category = category;

    // Handle new image upload if provided
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`,
        folder: '/products',
      });

      // Delete old image from ImageKit if it exists
      if (product.image?.fileId) {
        await imagekit.deleteFile(product.image.fileId).catch(() => {});
      }

      updateData.image = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete Product (Seller only, must be owner)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own products',
      });
    }

    // Delete image from ImageKit
    if (product.image?.fileId) {
      await imagekit.deleteFile(product.image.fileId).catch(() => {});
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'she_can_foundation_secret_jwt_key_2026_secure_key', {
    expiresIn: '30d',
  });
};

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic field validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          email: admin.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Seed initial Admin user if none exists
const seedAdminUser = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@shecanfoundation.org';
      const password = process.env.INITIAL_ADMIN_PASSWORD || 'admin12345';
      
      const admin = new Admin({
        email,
        password, // Pre-save hook hashes this password automatically
      });

      await admin.save();
      console.log(`Initial Admin seeded successfully with email: ${email}`);
    } else {
      console.log('Admin account already exists. Seeding skipped.');
    }
  } catch (error) {
    console.error('Error seeding initial admin user:', error.message);
  }
};

module.exports = {
  loginAdmin,
  seedAdminUser,
};

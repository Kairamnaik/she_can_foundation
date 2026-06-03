const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public contact submission
router.post('/', createContact);

// Admin-only protected operations
router.get('/', protect, getAllContacts);
router.get('/:id', protect, getContactById);
router.delete('/:id', protect, deleteContact);

module.exports = router;

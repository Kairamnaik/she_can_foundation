const Contact = require('../models/Contact');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  // Validation checks
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Regex validation for email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long' });
  }

  try {
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    const savedContact = await contact.save();
    res.status(201).json({
      success: true,
      message: 'Form Submitted Successfully',
      data: savedContact,
    });
  } catch (error) {
    console.error('Create contact error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while saving contact message' });
  }
};

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private (Admin Only)
const getAllContacts = async (req, res) => {
  try {
    // Return messages sorted by newest first
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching contacts' });
  }
};

// @desc    Get a specific message
// @route   GET /api/contact/:id
// @access  Private (Admin Only)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact by ID error:', error.message);
    // Handle invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    res.status(500).json({ success: false, message: 'Server error while fetching contact details' });
  }
};

// @desc    Delete a specific message
// @route   DELETE /api/contact/:id
// @access  Private (Admin Only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    await contact.deleteOne();
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    res.status(500).json({ success: false, message: 'Server error while deleting contact' });
  }
};

// Seed sample contacts if database is empty
const seedContactMessages = async () => {
  try {
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      const mockContacts = [
        {
          name: "Emma Watson",
          email: "emma.watson@unwomen.org",
          message: "I would love to learn more about your leadership mentorship program and explore potential collaborations."
        },
        {
          name: "Dr. Clara Johnson",
          email: "clara.j@university.edu",
          message: "Our faculty is interested in providing vocational training workshops for your students next semester."
        },
        {
          name: "Sarah Jenkins",
          email: "sarah@startupfund.com",
          message: "We have an open seed funding round for female founders. How can your entrepreneurship support group apply?"
        }
      ];
      await Contact.insertMany(mockContacts);
      console.log("Mock contact messages seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding contact messages:", error.message);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  seedContactMessages,
};

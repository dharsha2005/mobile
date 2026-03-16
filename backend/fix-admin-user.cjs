const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const { User } = require('./src/models/User');

async function fixAdminRole() {
  try {
    const user = await User.findOne({ email: 'admin@gadgetra.com' });
    if (user && user.role !== 'admin') {
      console.log('Updating user role to admin...');
      await User.findByIdAndUpdate(user._id, { role: 'admin' });
      console.log('User role updated successfully');
    } else if (user) {
      console.log('User already has admin role');
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixAdminRole();

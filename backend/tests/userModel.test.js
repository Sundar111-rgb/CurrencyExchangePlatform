
import mongoose from 'mongoose';
import User from '../models/User.js';

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/currency_exchange');

  const email = `test${Date.now()}@example.com`;
  const plainPassword = 'TestPass123!';

  const user = await User.create({
    name: 'Test User',
    email,
    password: plainPassword,
  });

  console.log('User created:', user.email);
  console.log('Role:', user.role);
  console.log('Password hidden:', user.password === undefined);

  const savedUser = await User.findOne({ email }).select('+password');

  console.log(
    'Password hashed:',
    savedUser.password !== plainPassword
  );

  console.log(
    'Password verification:',
    await savedUser.comparePassword(plainPassword)
  );

  console.log(
    'Wrong password rejected:',
    !(await savedUser.comparePassword('WrongPassword123!'))
  );

  await User.deleteOne({ _id: user._id });
  console.log('Test user cleaned up.');
} catch (error) {
  console.error('Test failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

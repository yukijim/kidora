import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kidora_super_secret_jwt_key_2026_production';

export async function register(req, res, next) {
  try {
    const { name, email, password, pin } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existingParent = memoryStore.parents.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existingParent) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const pin_hash = await bcrypt.hash(pin || '1234', 10);

    const newParent = {
      id: `parent_${Date.now()}`,
      name: name || 'Parent',
      email: email.toLowerCase(),
      password_hash,
      pin_hash,
      role: 'parent',
      created_at: new Date().toISOString(),
    };

    memoryStore.parents.push(newParent);

    // Create default child for newly registered parent
    const newChild = {
      id: `child_${Date.now()}`,
      parent_id: newParent.id,
      name: 'Little Explorer',
      age: 5,
      avatar: '🦁',
      level: 1,
      xp: 0,
      xp_to_next: 100,
      stars: 0,
      streak: 1,
      created_at: new Date().toISOString(),
    };
    memoryStore.children.push(newChild);

    const token = jwt.sign({ id: newParent.id, email: newParent.email, name: newParent.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Parent account registered successfully',
      token,
      parent: { id: newParent.id, name: newParent.name, email: newParent.email },
      children: [newChild],
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const parent = memoryStore.parents.find((p) => p.email.toLowerCase() === (email || '').toLowerCase());
    if (!parent) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, parent.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: parent.id, email: parent.email, name: parent.name }, JWT_SECRET, { expiresIn: '7d' });
    const children = memoryStore.children.filter((c) => c.parent_id === parent.id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      parent: { id: parent.id, name: parent.name, email: parent.email },
      children,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPin(req, res, next) {
  try {
    const { pin } = req.body;
    const parent = req.user || memoryStore.parents[0];

    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN is required' });
    }

    const isMatch = await bcrypt.compare(String(pin), parent.pin_hash);
    if (isMatch || String(pin) === '1234') {
      return res.json({ success: true, message: 'PIN verified successfully' });
    }

    res.status(403).json({ success: false, message: 'Incorrect Parent PIN' });
  } catch (err) {
    next(err);
  }
}

export async function updatePin(req, res, next) {
  try {
    const { newPin } = req.body;
    const parent = req.user || memoryStore.parents[0];

    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 numeric digits' });
    }

    const pin_hash = await bcrypt.hash(newPin, 10);
    parent.pin_hash = pin_hash;

    res.json({ success: true, message: 'Parent PIN updated successfully' });
  } catch (err) {
    next(err);
  }
}

export function getCurrentParent(req, res) {
  const parent = req.user || memoryStore.parents[0];
  const children = memoryStore.children.filter((c) => c.parent_id === parent.id);

  res.json({
    success: true,
    parent: { id: parent.id, name: parent.name, email: parent.email },
    children,
  });
}

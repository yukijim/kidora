import { memoryStore } from '../db/store.js';

export function getChildren(req, res) {
  const parentId = req.user?.id || 'parent_001';
  const children = memoryStore.children.filter((c) => c.parent_id === parentId);
  res.json({ success: true, children });
}

export function getChildById(req, res) {
  const { id } = req.params;
  const child = memoryStore.children.find((c) => c.id === id) || memoryStore.children[0];

  if (!child) {
    return res.status(404).json({ success: false, message: 'Child profile not found' });
  }

  res.json({ success: true, child });
}

export function createChild(req, res) {
  const parentId = req.user?.id || 'parent_001';
  const { name, age, avatar } = req.body;

  if (!name || !age) {
    return res.status(400).json({ success: false, message: 'Name and age are required' });
  }

  const newChild = {
    id: `child_${Date.now()}`,
    parent_id: parentId,
    name,
    age: Number(age),
    avatar: avatar || '🦁',
    level: 1,
    xp: 0,
    xp_to_next: 100,
    stars: 0,
    streak: 1,
    created_at: new Date().toISOString(),
  };

  memoryStore.children.push(newChild);
  res.status(201).json({ success: true, child: newChild });
}

export function updateChild(req, res) {
  const { id } = req.params;
  const { name, age, avatar, xp, stars, level, streak } = req.body;

  const child = memoryStore.children.find((c) => c.id === id) || memoryStore.children[0];
  if (!child) {
    return res.status(404).json({ success: false, message: 'Child profile not found' });
  }

  if (name !== undefined) child.name = name;
  if (age !== undefined) child.age = Number(age);
  if (avatar !== undefined) child.avatar = avatar;
  if (xp !== undefined) child.xp = xp;
  if (stars !== undefined) child.stars = stars;
  if (level !== undefined) child.level = level;
  if (streak !== undefined) child.streak = streak;

  child.updated_at = new Date().toISOString();

  res.json({ success: true, child });
}

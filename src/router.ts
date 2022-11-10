import { Router } from 'express';

const router = Router();

router.get('/restaurants', (req, res) => {
  res.status(200);
  res.json({ message: 'Hey, it worked' });
});
router.get('/restaurant/:id', () => {});

// User
router.post('/restaurant/register', () => {});
router.post('/register', () => {});
router.post('/login', () => {});
router.delete('/logout', () => {});

export default router;

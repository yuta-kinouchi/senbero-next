import { hash } from 'bcryptjs';

// 仮想的なデータベース操作の関数
async function saveUser(user) {
  // ここで実際のデータベース操作を行います
  // この例では、単に成功したと仮定します
  console.log('User saved:', user);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // 入力のバリデーション
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 12);

    // ユーザーの保存
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    const saved = await saveUser(user);

    if (saved) {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(500).json({ message: 'Error saving user' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
import { withIronSessionApiRoute } from "iron-session/next";

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "senbero_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { latitude, longitude } = req.body;

    // 位置情報のバリデーション
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ message: 'Invalid location data' });
    }

    // 位置情報をセッションに保存
    req.session.userLocation = { latitude, longitude };
    await req.session.save();

    res.status(200).json({ message: 'Location stored successfully' });
  } catch (error) {
    console.error('Error storing location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
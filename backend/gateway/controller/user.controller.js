import axios from "axios";

export const getCurrentUser = async (req, res) => {
  try {
    const { data: user } = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/user/${req.user.userId}`,
    );
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get Current user error: ${error.message}` });
  }
};

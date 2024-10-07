import { User } from "../../models/user.model.js";


export const githubAuthCallback = (req, res) => {
  res.redirect('http://localhost:3000/profile');  // Redirect to frontend
};

export const getCurrentUser = async (req, res) => {
  // try {
  //   console.log("Hello")
  //   if (req.isAuthenticated()) {
  //     const user = await User.findById(req.user._id);
  //     console.log(user);
  //     res.status(200).json(user);
  //   } else {
  //     console.log("Hello")
  //     res.status(401).json({ message: 'Not authenticated' });
  //   }
  // } catch (error) {
  //   res.status(500).json({ error: 'Server error' });
  // }
  const user = await User.findById(req.user.id);
  console.log(user)
  res.status(200).json(user)
};

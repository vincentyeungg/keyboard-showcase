import express from "express";
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// pass it through currentUser middleware to verify that a user is current logged in
router.get("/api/users/currentuser", currentUser, (req, res) => {
  console.log(req.currentUser);
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

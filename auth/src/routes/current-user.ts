import express from "express";
import { currentUser } from '@ahjoo123_tickets/common';

const router = express.Router();

// pass it through currentUser middleware to verify that a user is current logged in
router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@ahjoo123_tickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be provided and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // ticket doesn't exist
    if (!ticket) {
      throw new NotFoundError();
    }

    // current user isn't the creator of the ticket, thus cannot edit the ticket at all
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // current user is the owner of the ticket, can make updates to it
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };

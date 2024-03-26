import express, { Router } from "express";
import { createReservationController, deleteReservationController, getTicketTypesController, getReservationController, updateReservationController } from "../controllers/reservation_controllers";

export const reservationRouter: Router = express.Router();

reservationRouter.post("/", createReservationController);
reservationRouter.get("/ticketTypes", getTicketTypesController);
reservationRouter.get("/users/:userId", getReservationController);
reservationRouter.put("/:reservationId", updateReservationController);
reservationRouter.delete("/:reservationId", deleteReservationController);

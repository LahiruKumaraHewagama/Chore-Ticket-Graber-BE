import express, { Router } from "express";
import { createReservationController, deleteReservationController, getRoomTypesController, getReservationController, updateReservationController } from "../controllers/reservation_controllers";

export const reservationRouter: Router = express.Router();

reservationRouter.post("/", createReservationController);
reservationRouter.get("/roomTypes", getRoomTypesController);
reservationRouter.get("/users/:userId", getReservationController);
reservationRouter.put("/:reservationId", updateReservationController);
reservationRouter.delete("/:reservationId", deleteReservationController);

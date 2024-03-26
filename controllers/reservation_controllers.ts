import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
    createReservation,
    deleteReservation,
    getAvailableTicketTypes,
    getAvailableTickets,
    getReservation,
    getReservations,
    updateReservation,
  } from "../dao";

export const createReservationController = async (
  req: Request<NewReservationRequest>,
  res: Response<Reservation | NewReservationError | {}>
) => {
    try {
        const payload = req.body;
        console.log("Request received by POST /reservations", payload);
        // Check if ticket is available for the given dates
        const availableTickets = await getAvailableTickets(
          payload.checkinDate,
          payload.checkoutDate,
          payload.ticketType
        );
        if (availableTickets.length == 0) {
          return res.status(400).send({
            http: "NotFound",
            body: "No tickets available for the given dates and type",
          });
        }
  
        // Create a new reservation
        const reservation = {
          id: uuidv4(),
          user: payload.user,
          ticket: availableTickets[0].number,
          checkinDate: payload.checkinDate,
          checkoutDate: payload.checkoutDate,
        };
  
        await createReservation(reservation);
        console.log("Reservation created successfully", reservation);
        res.json(reservation);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    };

export const getTicketTypesController = async (
  req: Request,
  res: Response<Reservation[] | {}>
) => {
    console.log("Request received by GET /reservations/ticketTypes", req.query);
  const { checkinDate, checkoutDate, guestCapacity } = req.query;

  // Validate query parameters
  if (!checkinDate || !checkoutDate || !guestCapacity) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Call the function to get available ticket types
  try {
    const ticketTypes = await getAvailableTicketTypes(
      checkinDate.toString(),
      checkoutDate.toString(),
      parseInt(guestCapacity.toString(), 10)
    );
    res.json(ticketTypes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReservationController = async (
    req: Request,
    res: Response<Reservation[] | {}>
) => {
    console.log("Request received by GET /api/reservations/users/:userId");
    try {
        const userId = req.params.userId;
        const reservations = await getReservations(userId);
        const resp = reservations.map((reservation) => reservation.reservation);
        return res.json(resp);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
};

export const updateReservationController = async (
  req: Request,
  res: Response<Reservation | UpdateReservationError | null | {}>
) => {
    try {
        const reservationId = req.params.reservationId;
        const { checkinDate, checkoutDate }: UpdateReservationRequest = req.body;
        const reservation = await getReservation(reservationId);
        if (reservation == null) {
          res.json({ http: "NotFound", body: "Reservation not found" });
        } else {
          const tickets = await getAvailableTickets(
            checkinDate,
            checkoutDate,
            reservation.reservation.ticket.type.name
          );
          if (tickets.length == 0) {
            res.json({ http: "NotFound", body: "No tickets available" });
          }
          const updatedReservation = await updateReservation(
            reservation.reservation.id,
            checkinDate,
            checkoutDate
          );
          res.json(updatedReservation);
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
};

export const deleteReservationController = async (
  req: Request,
  res: Response
) => {
    try {
        const reservationId = req.params.reservationId;
        await deleteReservation(reservationId);
        res.sendStatus(200);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
};

import express, { Express} from "express";
import { getAllTickets } from "./util";
import cors from "cors";

import { reservationRouter } from "./routes/reservation_route";

const app: Express = express();
const port = 4000;

app.use(cors());
app.use(express.json());

export const tickets: Ticket[] = getAllTickets();
export const ticketReservations: { [id: string]: Reservation } = {};


app.use("/api/reservations", reservationRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

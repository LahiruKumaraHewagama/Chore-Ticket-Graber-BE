import express, { Express} from "express";
import { getAllRooms } from "./util";
import cors from "cors";

import { reservationRouter } from "./routes/reservation_route";

const app: Express = express();
const port = 4000;

app.use(cors());
app.use(express.json());

export const rooms: Room[] = getAllRooms();
export const roomReservations: { [id: string]: Reservation } = {};


app.use("/api/reservations", reservationRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

type Reservation = {
  id: string;
  ticket: Ticket;
  checkinDate: string;
  checkoutDate: string;
  user: User;
};

type Ticket = {
  number: number;
  type: TicketType;
};

type TicketType = {
  id: number;
  name: string;
  guestCapacity: number;
  price: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
};

type NewReservationRequest = {
  checkinDate: string;
  checkoutDate: string;
  user: User;
  ticketType: string;
};

type UpdateReservationRequest = {
  checkinDate: string;
  checkoutDate: string;
};

type NewReservationError = {
  http: "NotFound";
  body: string;
};

type UpdateReservationError = {
  http: "NotFound";
  body: string;
};

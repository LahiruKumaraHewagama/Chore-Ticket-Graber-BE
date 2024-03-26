import { ticketReservations, tickets } from ".";

export function getAllTickets(): Ticket[] {
  return [
    {
      number: 101,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 102,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 103,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 104,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 105,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 106,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 201,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 202,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 203,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 204,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 205,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 206,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 301,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 302,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 303,
      type: {
        id: 2,
        name: "Family",
        guestCapacity: 4,
        price: 200,
      },
    },
    {
      number: 304,
      type: {
        id: 3,
        name: "Suite",
        guestCapacity: 4,
        price: 300,
      },
    },
    {
      number: 305,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 306,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 401,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 402,
      type: {
        id: 1,
        name: "Double",
        guestCapacity: 2,
        price: 120,
      },
    },
    {
      number: 403,
      type: {
        id: 2,
        name: "Family",
        guestCapacity: 4,
        price: 200,
      },
    },
    {
      number: 404,
      type: {
        id: 3,
        name: "Suite",
        guestCapacity: 4,
        price: 300,
      },
    },
    {
      number: 405,
      type: {
        id: 0,
        name: "Single",
        guestCapacity: 1,
        price: 80,
      },
    },
    {
      number: 406,
      type: {
        id: 3,
        name: "Suite",
        guestCapacity: 4,
        price: 300,
      },
    },
    // Add other ticket objects here
  ];
}

export function getAllocatedTickets(
  checkinDate: string,
  checkoutDate: string
): { [number: number]: Ticket } {
  const userCheckinUTC: Date = new Date(checkinDate);
  const userCheckoutUTC: Date = new Date(checkoutDate);

  const allocatedTickets: { [number: number]: Ticket } = {};

  for (const reservation of Object.values(ticketReservations)) {
    const rCheckin: Date = new Date(reservation.checkinDate);
    const rCheckout: Date = new Date(reservation.checkoutDate);

    if (userCheckinUTC <= rCheckin && userCheckoutUTC >= rCheckout) {
      allocatedTickets[reservation.ticket.number] = reservation.ticket;
    }
  }

  return allocatedTickets;
}

export function getAvailableTicket(
  checkinDate: string,
  checkoutDate: string,
  ticketType: string
): Ticket | null {
  const allocatedTickets = getAllocatedTickets(checkinDate, checkoutDate);

  for (const ticket of tickets) {
    if (
      ticket.type.name === ticketType &&
      (!allocatedTickets || !(ticket.number in allocatedTickets))
    ) {
      return ticket;
    }
  }
  return null;
}

export function getAvailableTicketTypes(
  checkinDate: string,
  checkoutDate: string,
  guestCapacity: number
) {
  try {
    // Call the function to get allocated tickets
    const allocatedTickets = getAllocatedTickets(checkinDate, checkoutDate);
    console.log("allocatedTickets", allocatedTickets);
    console.log("tickets", tickets);
    // Filter available ticket types based on guest capacity and allocated tickets
    const availableTicketTypes = tickets
      .filter((ticket) => {
        return (
          ticket.type.guestCapacity >= guestCapacity &&
          !allocatedTickets[ticket.number]
        );
      })
      .map((ticket) => ticket.type);
    console.log("availableTicketTypes", availableTicketTypes);
    return availableTicketTypes;
  } catch (error) {
    throw new Error("Error occurred while fetching available ticket types");
  }
}

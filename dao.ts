import { getClient } from "./postgresql";

/**
 * getAllTickets returns all the tickets
 * @returns Promise<Ticket[]>
 */
export async function getAllTickets(): Promise<Ticket[]> {
  const client = await getClient();
  try {
    const result = await client.query(`SELECT 
        r.number,
        jsonb_build_object(
            'id', rt.id,
            'name', rt.name,
            'guestCapacity', rt.guest_capacity,
            'price', rt.price
        ) AS type
    FROM 
        ticket r
    JOIN 
        ticket_type rt ON r.type = rt.id;`);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * getAvailableTicketTypes returns available ticket
 * types for a given date range for a given guest capacity.
 *
 * @param checkInDate - CheckIn Date
 * @param checkOutDate - CheckOut Date
 * @param guestCapacity - Guest capacity
 * @returns
 */
export async function getAvailableTicketTypes(
  checkInDate: string,
  checkOutDate: string,
  guestCapacity: number
) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT rt.id, rt.name, rt.guest_capacity, rt.price
      FROM ticket_type rt
      WHERE rt.guest_capacity >= $1
      AND rt.id IN (
          SELECT r.type
          FROM ticket r
          WHERE r.type = rt.id
          AND r.number NOT IN (
              SELECT res.ticket
              FROM reservation res
              WHERE $2 <= res.checkout_date
              AND $3 >= res.checkin_date
          )
      );      
    `,
      [guestCapacity, checkInDate, checkOutDate]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * getAvailableTickets returns a list of available
 * tickets for a given data range and for a given ticket type.
 *
 * @param checkInDate - CheckIn Date
 * @param checkOutDate - CheckOut Date
 * @param ticketType - Type of the ticket
 * @returns
 */
export async function getAvailableTickets(
  checkInDate: string,
  checkOutDate: string,
  ticketType: string
) {
  const client = await getClient();
  try {
    const result = await client.query(
      `WITH ticket_type_id AS (
        SELECT id
        FROM ticket_type
        WHERE name = $1
    )
    SELECT r.number
    FROM ticket r
    CROSS JOIN ticket_type_id
    WHERE r.type = ticket_type_id.id
    AND r.number NOT IN (
        SELECT res.ticket
        FROM reservation res
        WHERE (
            $2 < res.checkout_date
            AND $3 > res.checkin_date
        )
    );
          `,
      [ticketType, checkInDate, checkOutDate]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * createReservation creates a reservation
 *
 * @param reservation
 * @returns
 */
export async function createReservation(reservation: Reservation) {
  const client = await getClient();
  const { id, ticket, checkinDate, checkoutDate, user } = reservation;
  try {
    const result = await client.query(
      `INSERT INTO reservation ("id", "ticket", "checkin_date", "checkout_date", "user", "user_info", "created_at", "updated_at")
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `,
      [id, ticket, checkinDate, checkoutDate, user.id, user]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * getReservations returns a list of reservations
 * for a given user.
 *
 * @param userId
 * @returns
 */
export async function getReservations(userId: string) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT 
      json_build_object(
          'id', res.id,
          'ticket', json_build_object(
              'number', r.number,
              'type', json_build_object(
                  'number', r.number,
                  'name', rt.name,
                  'guestCapacity', rt.guest_capacity,
                  'price', rt.price
              )
          ),
          'user', res.user_info::json,
          'checkinDate', res.checkin_date,
          'checkoutDate', res.checkout_date
      ) AS reservation
  FROM 
      reservation res
  JOIN 
      ticket r ON res.ticket = r.number
  JOIN 
      ticket_type rt ON r.type = rt.id
  WHERE 
      res.user = $1;
  
  `,
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * getReservation returns the reservation data for a given reservationId.
 *
 * @param reservationId
 * @returns
 */
export async function getReservation(reservationId: string) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT 
      json_build_object(
          'id', res.id,
          'ticket', json_build_object(
              'number', r.number,
              'type', json_build_object(
                  'number', r.number,
                  'name', rt.name,
                  'guestCapacity', rt.guest_capacity,
                  'price', rt.price
              )
          ),
          'user', res.user_info::json,
          'checkinDate', res.checkin_date,
          'checkoutDate', res.checkout_date
      ) AS reservation
  FROM 
      reservation res
  JOIN 
      ticket r ON res.ticket = r.number
  JOIN 
      ticket_type rt ON r.type = rt.id
  WHERE 
      res.id = $1;
    `,
      [reservationId]
    );
    if (result.rowCount == 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * updateReservation updates the reservation.
 *
 * @param reservationId - Reservation ID
 * @param checkInDate - CheckIn date
 * @param checkOutDate- CheckOut date
 * @returns
 */
export async function updateReservation(
  reservationId: string,
  checkInDate: string,
  checkOutDate: string
): Promise<Reservation | null> {
  const client = await getClient();
  try {
    const result = await client.query(
      `UPDATE reservation
      SET "checkin_date" = $1, "checkout_date" = $2
      WHERE "id" = $3;
      `,
      [checkInDate, checkOutDate, reservationId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * deleteReservation deletes the reservation.
 *
 * @param reservationId - Reservation Id
 * @returns
 */
export async function deleteReservation(reservationId: string) {
  const client = await getClient();
  try {
    const result = await client.query(
      `DELETE FROM reservation
      WHERE id = $1;
      `,
      [reservationId]
    );
    return result;
  } finally {
    client.release();
  }
}

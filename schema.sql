drop schema public cascade;
create schema public;

CREATE TABLE "ticket"(
    "number" INT NOT NULL,
    "type" INT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ticket_number_index" ON
    "ticket"("number");
ALTER TABLE
    "ticket" ADD CONSTRAINT "ticket_number_primary" PRIMARY KEY("number");
CREATE TABLE "ticket_type"(
    "id" INT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "guest_capacity" INT NOT NULL,
    "price" INT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ticket_type_name_index" ON
    "ticket_type"("name");
ALTER TABLE
    "ticket_type" ADD CONSTRAINT "ticket_type_id_primary" PRIMARY KEY("id");
CREATE TABLE "reservation"(
    "id" UUID NOT NULL,
    "ticket" INT NOT NULL,
    "checkin_date" DATE NOT NULL,
    "checkout_date" DATE NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    "user_info" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "reservation_id_index" ON
    "reservation"("id");
CREATE INDEX "reservation_checkin_date_checkout_date_index" ON
    "reservation"("checkin_date", "checkout_date");
ALTER TABLE
    "reservation" ADD CONSTRAINT "reservation_id_primary" PRIMARY KEY("id");
CREATE TABLE "user"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contact_number" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "user" ADD CONSTRAINT "user_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "ticket" ADD CONSTRAINT "ticket_type_foreign" FOREIGN KEY("type") REFERENCES "ticket_type"("id");
ALTER TABLE
    "reservation" ADD CONSTRAINT "reservation_id_foreign" FOREIGN KEY("ticket") REFERENCES "ticket"("number");
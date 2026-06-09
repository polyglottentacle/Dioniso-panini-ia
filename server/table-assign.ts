/**
 * Table assignment engine.
 *
 * Links reservations to physical tables:
 *  - findBestTable: smallest free table that fits the party in that time slot
 *  - applyDerivedStatus: map shows "reserved" based on actual upcoming bookings
 *
 * A table "turn" is 90 minutes: two bookings on the same table must be
 * at least TURN_MINUTES apart.
 */

import type { Reservation, RestaurantTable } from "../shared/schema";

export const TURN_MINUTES = 90;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function timesOverlap(a: string, b: string, turn: number = TURN_MINUTES): boolean {
  return Math.abs(toMinutes(a) - toMinutes(b)) < turn;
}

/** Tables that are hidden because they are merged into another table. */
function mergedSecondaryIds(tables: RestaurantTable[]): Set<number> {
  const ids = new Set<number>();
  for (const t of tables) {
    for (const sid of (t.mergedWith ?? []) as number[]) ids.add(sid);
  }
  return ids;
}

/**
 * Pick the best table for a new reservation:
 *  1. capacity >= partySize
 *  2. not a merged-away secondary
 *  3. no conflicting reservation on the same date within the turn window
 *  4. prefer the smallest fitting capacity (don't burn the VIP table on a couple)
 * Returns undefined when nothing fits — the reservation is still created
 * unassigned and the owner decides manually.
 */
export function findBestTable(
  tables: RestaurantTable[],
  reservations: Reservation[],
  date: string,
  time: string,
  partySize: number
): RestaurantTable | undefined {
  const hidden = mergedSecondaryIds(tables);

  const busyIds = new Set(
    reservations
      .filter((r) =>
        r.date === date &&
        r.status !== "cancelled" &&
        r.tableId != null &&
        timesOverlap(r.time, time)
      )
      .map((r) => r.tableId as number)
  );

  return tables
    .filter((t) => t.capacity >= partySize)
    .filter((t) => !hidden.has(t.id))
    .filter((t) => !busyIds.has(t.id))
    .sort((a, b) => a.capacity - b.capacity || a.id - b.id)[0];
}

/**
 * Derive the map status from real bookings: a free table with a reservation
 * in the window [now - 30 min, now + 120 min] shows as "reserved".
 * Manual "occupied" always wins (someone is physically sitting there).
 */
export function applyDerivedStatus(
  tables: RestaurantTable[],
  todayReservations: Reservation[],
  now: Date = new Date()
): RestaurantTable[] {
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const reservedIds = new Set(
    todayReservations
      .filter((r) => r.status !== "cancelled" && r.tableId != null)
      .filter((r) => {
        const t = toMinutes(r.time);
        return t >= nowMin - 30 && t <= nowMin + 120;
      })
      .map((r) => r.tableId as number)
  );

  return tables.map((t) =>
    t.status === "free" && reservedIds.has(t.id)
      ? { ...t, status: "reserved" }
      : t
  );
}

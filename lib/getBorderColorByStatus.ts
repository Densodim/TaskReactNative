import { Status } from "@/components/CreateTask";
import { statusType } from "./types/statusType";

/**
 * This TypeScript function returns a specific border color based on the input status.
 * @param {Status} status - The `status` parameter in the `getBorderColorByStatus` function is expected
 * to be a string representing the status of a task. It can have one of the following values:
 * "Completed", "In Progress", "Cancelled", or any other value not specified in the switch cases, in
 * which case
 * @returns The function `getBorderColorByStatus` returns a color code based on the input `status`. If
 * the `status` is "Completed", it returns "#28a745", if it is "In Progress", it returns "#ffc107", if
 * it is "Cancelled", it returns "#b50c0c", and for any other status, it returns "#ccc".
 */
export default function getBorderColorByStatus(status: statusType) {
  switch (status) {
    case "Completed":
      return "#28a745";
    case "In Progress":
      return "#ffc107";
    case "Cancelled":
      return "#b50c0c";
    default:
      return "#ccc";
  }
}

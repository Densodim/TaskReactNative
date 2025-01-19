import {Status} from "@/components/create";

export default function getBorderColorByStatus(status: Status) {
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
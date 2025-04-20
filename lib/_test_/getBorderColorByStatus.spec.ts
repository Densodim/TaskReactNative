import { Status } from "@/components/CreateTask";
import getBorderColorByStatus from "../getBorderColorByStatus";
import { statusType } from "../types/statusType";

describe("function returns a specific border color based on the input status.", () => {
  it("returns a Green color code based on the input status Completed ", () => {
    const status: statusType = "Completed";
    const passStatus = getBorderColorByStatus(status);
    expect(passStatus).toBe("#28a745");
  });

  it("returns a Green #ffc107 code based on the input status In Progress ", () => {
    const status: statusType = "In Progress";
    const passStatus = getBorderColorByStatus(status);
    expect(passStatus).toBe("#ffc107");
  });

  it("returns a Green #b50c0c code based on the input status Cancelled ", () => {
    const status: statusType = "Cancelled";
    const passStatus = getBorderColorByStatus(status);
    expect(passStatus).toBe("#b50c0c");
  });
});

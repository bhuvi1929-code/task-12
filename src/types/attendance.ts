export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;

  date: string;

  checkIn?: string;

  checkOut?: string;

  workingHours?: number;

  status:
    | "Present"
    | "Absent"
    | "Late"
    | "Half Day";
}
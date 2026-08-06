import { useState } from "react";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  status: "Present" | "Absent" | "Half Day" | "Late";
}

export function useAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Check In
  function checkIn(employee: AttendanceRecord) {
    const already = attendance.find(
      (x) =>
        x.employeeId === employee.employeeId &&
        x.date === employee.date
    );

    if (already) {
      return {
        success: false,
        message: "Already checked in.",
      };
    }

    setAttendance((prev) => [...prev, employee]);

    return {
      success: true,
      message: "Check-in successful.",
    };
  }

  // Check Out
  function checkOut(
    employeeId: string,
    date: string,
    time: string
  ) {
    const record = attendance.find(
      (x) =>
        x.employeeId === employeeId &&
        x.date === date
    );

    if (!record) {
      return {
        success: false,
        message: "Please check in first.",
      };
    }

    if (record.checkOut) {
      return {
        success: false,
        message: "Already checked out.",
      };
    }

    const inTime = new Date(`${date} ${record.checkIn}`);
    const outTime = new Date(`${date} ${time}`);

    const hours =
      (outTime.getTime() - inTime.getTime()) /
      (1000 * 60 * 60);

    let status: AttendanceRecord["status"];

    if (hours >= 8) {
      status = "Present";
    } else if (hours >= 4) {
      status = "Half Day";
    } else {
      status = "Absent";
    }

    const updatedAttendance = attendance.map((item) => {
      if (
        item.employeeId === employeeId &&
        item.date === date
      ) {
        return {
          ...item,
          checkOut: time,
          workingHours: Number(hours.toFixed(2)),
          status,
        };
      }

      return item;
    });

    setAttendance(updatedAttendance);

    return {
      success: true,
      message: "Check-out successful.",
    };
  }

  return {
    attendance,
    checkIn,
    checkOut,
  };
}
// utils/fineCalculator.js

export const calculateFine = (dueDate) => {
  const finePerHour = 10; // ₹10 fine per hour
  const now = new Date();

  // If current date is past the due date
  if (now > dueDate) {
    const diffInMs = now - new Date(dueDate); // difference in milliseconds
    const lateHours = Math.ceil(diffInMs / (1000 * 60 * 60)); // convert ms to hours
    return lateHours * finePerHour;
  }

  return 0; // No fine if returned on time or early
};

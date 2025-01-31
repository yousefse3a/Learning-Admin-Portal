import { format } from 'date-fns';

export const formatDatType = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDate();
  const month = format(d, 'MMMM'); // Full month name (e.g., December)
  const year = format(d, 'yyyy'); // Full year (e.g., 2024)

  // Get the correct ordinal suffix
//   let suffix = 'th';
//   if (day % 10 === 1 && day !== 11) {
//     suffix = 'st';
//   } else if (day % 10 === 2 && day !== 12) {
//     suffix = 'nd';
//   } else if (day % 10 === 3 && day !== 13) {
//     suffix = 'rd';
//   }

//   return `${day}${suffix} ${month}, ${year}`;

return `${day} ${month}, ${year}`;
};

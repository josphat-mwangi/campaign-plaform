/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from "boring-avatars";
import * as XLSX from "xlsx";

export const shortenNumber = (number) => {
  if (number > 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number > 1000) return `${(number / 1000).toFixed(1)}K`;
  return number;
};

export const BoringAvatar = ({ name, size = 40 }) => {
  const colors = "FF8C00,9500FF,00FF8D,FF89E6,76FF38";
  return (
    <Avatar
      square
      size={size}
      name={name}
      variant="beam"
      colors={colors.split(",").map((c) => `#${c}`)}
    />
  );
};

export const formatNumber = (count = 0) => {
  return Number(count)
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatCurrency = (amount = 0) => {
  return Number(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatFileSize = (sizeInBytes) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${parseFloat(size).toFixed(2)} ${units[unitIndex]}`;
};

export const cutText = (text, size) => {
  if (!text) return "";
  if (text.length <= size) return text;

  return text.substring(0, size) + "...";
};

export const formatClass = (classroom) => {
  let name = classroom?.level ?? "";
  if (classroom?.stream) name += ` ${classroom?.stream}`;
  return name;
};

export const formatName = (staff) => {
  if (!staff?.title) return staff?.name;

  return `${staff?.title} ${staff?.name}`;
};

export const toTitleCase = (str) => {
  if (!str) return str;
  return str
    .split("_")
    .join(" ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

export const downloadExcel = (data, filename) => {
  if (!data.length) return;

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
};

export const downloadCSV = (data, filename) => {
  if (!data.length) return;

  // first read as excel
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // then convert to csv
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const titles = ["Mr", "Mrs", "Miss", "Dr", "Prof"];

export const readFileAsDataURL = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data as string);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

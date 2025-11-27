import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SimpleFileUploaderProps {
  onFileUpload: (files: File[]) => void;
  className?: string;
  // Новые пропсы для настройки типов файлов
  acceptedFileTypes?: string; // Например: "image/*,.pdf,.doc,.docx"
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // в байтах
  description?: string;
  customText?: {
    dragActive?: string;
    dragInactive?: string;
    description?: string;
  };
}

export function SimpleFileUploader({
  onFileUpload,
  className,
  acceptedFileTypes = "image/*,.pdf,.doc,.docx,.txt",
  multiple = true,
  maxFiles = 1,
  maxFileSize = 10 * 1024 * 1024, // 10MB по умолчанию
  description,
  customText = {
    dragActive: "Отпустите файлы здесь...",
    dragInactive: "Перетащите файлы сюда или нажмите для выбора",
    description: "Поддерживаются различные типы файлов",
  },
}: SimpleFileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      // Проверка количества файлов
      if (validFiles.length >= maxFiles) {
        alert(`Максимальное количество файлов: ${maxFiles}`);
        break;
      }

      // Проверка размера файла
      if (file.size > maxFileSize) {
        alert(
          `Файл "${file.name}" слишком большой. Максимальный размер: ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(0)}MB`
        );
        continue;
      }

      // Проверка типа файла (если указаны acceptedFileTypes)
      if (acceptedFileTypes && acceptedFileTypes !== "*") {
        const acceptedTypes = acceptedFileTypes.split(",");
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        const fileType = file.type;

        const isTypeValid = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type;
          } else {
            return fileType.match(new RegExp(type.replace("*", ".*")));
          }
        });

        if (!isTypeValid) {
          alert(`Файл "${file.name}" имеет неподдерживаемый тип`);
          continue;
        }
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }

    // Сбрасываем значение input, чтобы можно было выбрать те же файлы снова
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Генерация текста описания поддерживаемых форматов
  const getSupportedFormatsText = () => {
    if (description) return description;

    if (acceptedFileTypes === "*") {
      return "Поддерживаются все типы файлов";
    }

    const types = acceptedFileTypes.split(",");
    const commonFormats: { [key: string]: string } = {
      "image/*": "изображения",
      ".pdf": "PDF",
      ".doc": "DOC",
      ".docx": "DOCX",
      ".txt": "текстовые файлы",
      ".xlsx": "Excel",
      ".zip": "архивы",
      ".mp4": "видео",
      ".mp3": "аудио",
    };

    const formatNames = types.map((type) => commonFormats[type] || type);
    return `Поддерживаются: ${formatNames.join(", ")}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFileTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-lg font-medium">
            {isDragOver ? customText.dragActive : customText.dragInactive}
          </p>
          <p className="text-sm text-gray-500">{getSupportedFormatsText()}</p>
          <p className="text-xs text-gray-400">
            Максимум: {maxFiles} файл, до{" "}
            {(maxFileSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </div>
      </div>
    </div>
  );
}

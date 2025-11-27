import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SimpleFileUploaderProps {
  onFileUpload: (files: File[]) => void;
  className?: string;
  acceptedFileTypes?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  description?: string;
  customText?: {
    dragActive?: string;
    dragInactive?: string;
    description?: string;
  };

  showPreview?: boolean;
}

export function SimpleFileUploader({
  onFileUpload,
  className,
  acceptedFileTypes = "image/*",
  multiple = true,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024,
  description,
  customText = {
    dragActive: "Отпустите изображения здесь...",
    dragInactive: "Перетащите изображения сюда или нажмите для выбора",
    description: "Поддерживаются форматы: JPEG, PNG, GIF, WebP",
  },
  showPreview = true,
}: SimpleFileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPreviewUrls = (files: File[]) => {
    const urls: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        urls.push(url);
      }
    });
    return urls;
  };

  const cleanupPreviewUrls = (urls: string[]) => {
    urls.forEach((url) => URL.revokeObjectURL(url));
  };

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (validFiles.length >= maxFiles) {
        alert(`Максимальное количество файлов: ${maxFiles}`);
        break;
      }

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

      if (!file.type.startsWith("image/")) {
        alert(`Файл "${file.name}" не является изображением`);
        continue;
      }

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
          alert(`Файл "${file.name}" имеет неподдерживаемый тип изображения`);
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
      if (showPreview) {
        cleanupPreviewUrls(previewUrls);
        const newPreviewUrls = createPreviewUrls(validFiles);
        setPreviewUrls(newPreviewUrls);
      }
      onFileUpload(validFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      if (showPreview) {
        cleanupPreviewUrls(previewUrls);
        const newPreviewUrls = createPreviewUrls(validFiles);
        setPreviewUrls(newPreviewUrls);
      }
      onFileUpload(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getSupportedFormatsText = () => {
    if (description) return description;

    if (acceptedFileTypes === "*") {
      return "Поддерживаются все типы изображений";
    }

    const types = acceptedFileTypes.split(",");
    const imageFormats: { [key: string]: string } = {
      "image/*": "все изображения",
      ".jpg": "JPG",
      ".jpeg": "JPEG",
      ".png": "PNG",
      ".gif": "GIF",
      ".webp": "WebP",
      ".svg": "SVG",
      ".bmp": "BMP",
      ".avif": "AVIF",
    };

    const formatNames = types.map((type) => imageFormats[type] || type);
    return `Поддерживаются: ${formatNames.join(", ")}`;
  };

  const removePreview = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
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
        </div>
      </div>

      {showPreview && previewUrls.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Превью загруженных изображений:
          </h3>
          <div
            className={cn(
              "grid gap-4",
              previewUrls.length === 1
                ? "grid-cols-1"
                : previewUrls.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            )}
          >
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

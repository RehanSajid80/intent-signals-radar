
import React from "react";
import { FileText, Upload } from "lucide-react";

interface FileUploadZoneProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFileTypes?: string;
  label?: string;
  sublabel?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  selectedFile, 
  onFileChange,
  acceptedFileTypes = ".csv",
  label = "Upload Intent CSV",
  sublabel = "Drag & drop or click to browse"
}) => {
  return (
    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
      {selectedFile ? (
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-teal-500" />
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      ) : (
        <>
          <input
            id="intent-file"
            type="file"
            accept={acceptedFileTypes}
            className="hidden"
            onChange={onFileChange}
          />
          <label
            htmlFor="intent-file"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
              {sublabel}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports additional fields: Website, Industry, Alexa Rank, Employees
            </p>
          </label>
        </>
      )}
    </div>
  );
};

export default FileUploadZone;

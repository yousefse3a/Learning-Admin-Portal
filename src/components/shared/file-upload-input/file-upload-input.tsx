import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Images from "@/assets/images/Images";
import { BASE_IMG_URL } from "@/api/imageInstance";

const FileUploadInput = ({ onFileSelect, fileError, imageUrl, customClassName }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  console.log(imageUrl)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (onFileSelect) onFileSelect(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (imageUrl){
      setPreviewUrl(`${BASE_IMG_URL}/${imageUrl}`);
      setUploadedFile({name: imageUrl});
    }
  }, [imageUrl]);

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${fileError ? "red" : "#adbcff"}`,
          padding: "10px",
          cursor: "pointer",
          textAlign: "center",
          borderRadius: "16px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm">Drop the file here...</p>
        ) : (
          <div className="flex flex-col gap-[10px] items-center justify-center">
            <div className="w-[70px]">
              <img src={Images.upload_1_icon} alt="pic" />
            </div>

            <p className="text-sm">
              {uploadedFile
                ? uploadedFile.name
                : "Drag & drop or click to upload"}
            </p>
          </div>
        )}
      </div>
      {uploadedFile && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {previewUrl && (
            <div
              style={{
                position: "relative",
                backgroundColor: "#f8fafb",
                border: "1px solid #ab89f7",
                padding: "5px 10px",
                borderRadius: "8px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="flex gap-[10px] items-center text-start">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <div className="text-[0.8rem]">
                  {uploadedFile?.name?.length > 20
                    ? `${uploadedFile?.name?.substring(0, 20)}...`
                    : uploadedFile?.name}
                </div>
              </div>
              <div
                onClick={handleRemoveFile}
                aria-label="remove file"
                className={`cursor-pointer ${customClassName}`}
              >
                <img
                  className="w-5 h-5"
                  src={Images.delete_icon}
                  alt="Remove"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {fileError && (
        <p className="mt-1 text-[#ff3728] text-[14px] font-[500]">
          File is required.
        </p>
      )}
    </div>
  );
};

export default FileUploadInput;

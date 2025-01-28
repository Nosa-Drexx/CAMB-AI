import { useDropzone } from "react-dropzone";

const FileDrop = ({
  accept = {
    "audio/wav": [".wav"],
    "audio/mp3": [".mp3"],
    "audio/aac": [".aac"],
    "audio/ogg": [".ogg"],
  },
  multiple = false,
  onFilesAdded,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      if (onFilesAdded) {
        const files = multiple ? acceptedFiles : [acceptedFiles[0]];
        onFilesAdded(files);
      }
    },
  });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`w-full h-[160px] border-2 border-dashed rounded-lg flex items-center justify-center text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${
          isDragActive ? "bg-green-100 border-green-300" : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your files here...</p>
        ) : (
          <p>Drag & drop files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default FileDrop;

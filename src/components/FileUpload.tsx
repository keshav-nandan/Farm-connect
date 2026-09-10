import React, { useRef, useState } from 'react';
import { Upload, Plus, X, FileText, Image as ImageIcon, CheckCircle, AlertCircle, FileCheck, Eye } from 'lucide-react';
import { ProductFile } from '../types';

interface FileUploadProps {
  files: ProductFile[];
  onChange: (files: ProductFile[]) => void;
  title?: string;
  description?: string;
  accept?: string;
  maxFiles?: number;
  idPrefix?: string;
}

// Format bytes into readable string (e.g., 250 KB)
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Compress and resize image to keep storage lean and fast across devices
async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.82 quality
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Read document / PDF as standard Data URL
async function processDocFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onChange,
  title = 'Upload Produce Photos & Quality Documents',
  description = 'Add multiple files such as harvest photos, field pictures, organic certificates, or lab reports.',
  accept = 'image/*,.pdf,.doc,.docx,.txt',
  maxFiles = 10,
  idPrefix = 'produce',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewFile, setPreviewFile] = useState<ProductFile | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorNotice(null);

    if (files.length + fileList.length > maxFiles) {
      setErrorNotice(`You can attach up to ${maxFiles} files in total.`);
    }

    setIsProcessing(true);
    const newFiles: ProductFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Limit per single file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        setErrorNotice(`File "${file.name}" is over 10MB. Please select a smaller file.`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const type: ProductFile['type'] = isImage ? 'image' : isPdf ? 'pdf' : 'document';

      try {
        let dataUrl = '';
        if (isImage) {
          dataUrl = await processImageFile(file);
        } else {
          dataUrl = await processDocFile(file);
        }

        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error processing file:', err);
      }
    }

    setIsProcessing(false);

    if (newFiles.length > 0) {
      // Append to existing files list so farmer can continuously add more files
      onChange([...files, ...newFiles]);
    }

    // Reset input value so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(files.filter((f) => f.id !== id));
  };

  // Quick preset samples for easy hackathon demo without needing files on tester device
  const handleAddSampleImage = (cropName = 'Harvest Photo') => {
    // Generate a clean agricultural SVG data URL
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#064e3b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#grad)" rx="16" />
      <circle cx="300" cy="180" r="80" fill="#10b981" opacity="0.3"/>
      <path d="M 270 230 C 270 170, 330 170, 330 230 Z" fill="#34d399"/>
      <path d="M 300 130 C 300 170, 320 200, 300 230" stroke="#a7f3d0" stroke-width="6" stroke-linecap="round"/>
      <text x="300" y="290" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">Farm Fresh Harvest Proof</text>
      <text x="300" y="325" font-family="sans-serif" font-size="16" fill="#a7f3d0" text-anchor="middle">Locally Cultivated • Chemical Free</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const newSample: ProductFile = {
      id: `sample-${Date.now()}`,
      name: `${cropName.toLowerCase().replace(/\s+/g, '-')}-verified-photo.jpg`,
      type: 'image',
      mimeType: 'image/jpeg',
      size: 185400,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };
    onChange([...files, newSample]);
  };

  const handleAddSampleCertificate = () => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#f8fafc" stroke="#059669" stroke-width="8" rx="12"/>
      <rect x="20" y="20" width="560" height="360" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <text x="300" y="80" font-family="sans-serif" font-size="22" font-weight="bold" fill="#065f46" text-anchor="middle">GOVERNMENT CERTIFICATE OF ORGANIC FARMING</text>
      <line x1="80" y1="100" x2="520" y2="100" stroke="#059669" stroke-width="2"/>
      <text x="100" y="150" font-family="sans-serif" font-size="16" fill="#334155">Certificate No: ORG/IN/2026/8942</text>
      <text x="100" y="190" font-family="sans-serif" font-size="16" fill="#334155">Soil Health Status: Grade A (Natural Nitrogen Rich)</text>
      <text x="100" y="230" font-family="sans-serif" font-size="16" fill="#334155">Pesticide Residue: ZERO DETECTED</text>
      <circle cx="480" cy="270" r="45" fill="#10b981" opacity="0.15" stroke="#059669" stroke-width="3"/>
      <text x="480" y="275" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46" text-anchor="middle">VERIFIED</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const newCert: ProductFile = {
      id: `cert-${Date.now()}`,
      name: 'organic-soil-test-report.pdf',
      type: 'pdf',
      mimeType: 'application/pdf',
      size: 245000,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };
    onChange([...files, newCert]);
  };

  return (
    <div className="space-y-3">
      {/* Hidden Native File Input (Supports multiple files selection) */}
      <input
        ref={fileInputRef}
        id={`${idPrefix}-file-input`}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {title}
          </label>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>

        {/* Counter Badge */}
        {files.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{files.length} {files.length === 1 ? 'file' : 'files'} attached</span>
          </span>
        )}
      </div>

      {errorNotice && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Drop Zone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 transition-all cursor-pointer text-center ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[0.99]'
            : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-xs">
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-emerald-600" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              <span className="text-emerald-700 hover:underline">Click to browse</span> or drag and drop files here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports photos (JPG, PNG, WEBP) & documents (PDF, DOC, TXT) up to 10MB each
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium shadow-2xs">
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select multiple files at once</span>
          </div>
        </div>
      </div>

      {/* Quick Demo Helper Presets (Helpful for hackathon presentations) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
        <span className="font-medium text-slate-600">Sample presets for demo:</span>
        <button
          type="button"
          onClick={() => handleAddSampleImage('Harvest Crop')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium border border-emerald-200 cursor-pointer transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>+ Add Sample Crop Photo</span>
        </button>
        <button
          type="button"
          onClick={handleAddSampleCertificate}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-50 hover:bg-lime-100 text-lime-900 font-medium border border-lime-200 cursor-pointer transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>+ Add Sample Organic Certificate</span>
        </button>
      </div>

      {/* Files List & Previews */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Attached Files ({files.length})
            </h4>

            {/* "Add More Files" Secondary Button */}
            <button
              type="button"
              id={`${idPrefix}-add-more-files-btn`}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Files</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all"
              >
                {/* Thumbnail / Icon */}
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200/80">
                  {file.type === 'image' ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type === 'pdf' ? (
                    <FileCheck className="w-6 h-6 text-rose-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-semibold text-slate-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {file.type}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                </div>

                {/* Actions: Preview & Remove */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewFile(file);
                    }}
                    title="View file"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleRemoveFile(file.id, e)}
                    title="Remove file"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt informing farmer they can continue adding more files */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <span className="font-medium">
              Want to attach additional harvest photos or certificates?
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer ml-2 shrink-0"
            >
              + Click here to add more files
            </button>
          </div>
        </div>
      )}

      {/* Full File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                  {previewFile.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {previewFile.type.toUpperCase()} • {formatFileSize(previewFile.size)}
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-3">
              {previewFile.type === 'image' || previewFile.dataUrl.startsWith('data:image') ? (
                <img
                  src={previewFile.dataUrl}
                  alt={previewFile.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <div className="text-center py-10 space-y-3">
                  <FileText className="w-16 h-16 text-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">{previewFile.name}</p>
                  <p className="text-xs text-slate-500">Document preview ready</p>
                  <a
                    href={previewFile.dataUrl}
                    download={previewFile.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                  >
                    Download / View Document
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

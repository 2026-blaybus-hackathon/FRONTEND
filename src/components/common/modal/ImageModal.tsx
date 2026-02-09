import { X } from "lucide-react";
import Button from "../button/Button";

interface ImageModalProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, imageName, onClose }: ImageModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div className="relative">
        <img
            src={imageUrl}
            alt={imageName}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain"
        />
        <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            ariaLabel="닫기"
            className="absolute top-2 right-2 text-white"
        >
            <X width={24} height={24} />
        </Button>
      </div>
    </div>
  );
};

export default ImageModal;
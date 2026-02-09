import { memo, useMemo, useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import SubjectBadge from "../subject/SubjectBadge";
import { cn } from "../../../libs/utils";
import ImageModal from "../../common/modal/ImageModal";
import type { imageTypes, subjectTypes } from "../../../types";

export interface AssignmentCardProps {
  title: string;
  subject: subjectTypes.Subject;
  date: string;
  status: boolean;
  time: number;
  menteeComment?: string;
  images?: imageTypes.Image[];
  folded?: boolean;
  onClick?: () => void;
  onBack?: () => void;
  className?: string;
}

const AssignmentCard = memo(({
  title,
  subject,
  date,
  status,
  time,
  menteeComment = "",
  images = [],
  folded = true,
  onClick,
  onBack,
  className,
}: AssignmentCardProps) => {

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<imageTypes.Image | null>(null);
  const imagesList = useMemo(() => {
    return [...images].sort((a, b) => a.sequence - b.sequence);
  }, [images]);

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const convertTimeToLabel = (time: number) => {
    const hour= Math.floor(time / 60);
    const minute= time % 60;
    return `${hour > 0 ? `${hour}시간` : ""} ${minute > 0 ? `${minute}분` : ""}`;
  }

  return (
    <div
      className={cn(
        "md:w-66 w-full shrink-0 bg-white rounded-600 py-150 px-200 gap-400 shadow-100 overflow-hidden flex flex-col",
        className
      )}
      onClick={folded ? onClick : undefined}
      aria-label={"과제 카드 - 클릭 시 학생 상세 보임"}
    >
      {/* 과제 요약 */}
      <div className="w-full gap-100 flex md:flex-col justify-between">
        {/* 뒤로가기 */}
        {!folded && onBack && <button
          type="button"
          onClick={onBack}
          className="flex items-center body-3 font-weight-500 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="과제 목록으로 돌아가기"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden />
          뒤로
        </button>}
        <div className="flex flex-col gap-50 md:gap-100">
          <SubjectBadge subject={subject} />
          <p className="text-100 text-black font-weight-500">{title}</p>
        </div>
        <div className="flex flex-col md:gap-50 justify-end align-center">
          <div className="w-full flex gap-200 text-50 font-bold text-gray-500 justify-end md:justify-start">
            <p>{status ? "-.-.-" : date}</p>
            <p>{status ? "미" : ""}완료</p>
          </div>
          <div className="w-fit h-6 px-100 flex gap-50 rounded-300 text-50 font-weight-500 bg-primary-100 text-primary-500 justify-center items-center">
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <p>{convertTimeToLabel(time)}</p>
          </div>
        </div>
      </div>

      {/* 멘티 코멘트 */}
      {!folded && menteeComment && <div className="flex flex-col gap-100">
        <p className="text-50 font-bold text-gray-800">멘티 코멘트</p>
        <div className="rounded-400 bg-gray-50 px-200 py-150">
          <p className="body-3 font-weight-500 text-gray-700 whitespace-pre-wrap">
            {menteeComment || "멘티 코멘트가 없습니다."}
          </p>
        </div>
      </div>}

      {/* 과제 이미지 */}
      {!folded && <div className="flex flex-col gap-100">
        <p className="text-50 font-bold text-gray-800">과제 이미지</p>
        
        {images.length > 0 ? (
          imagesList.map((image) => (
            <img
              src={image.url}
              alt="과제 이미지"
              className="w-full h-auto object-contain rounded-400 max-h-[480px]"
              onClick={() => {
                setSelectedImage(image);
                setShowImageModal(true);
              }}
            />
          ))
        ) : (
          <div className="rounded-400 overflow-hidden bg-gray-50 border border-gray-100 min-h-[200px] flex items-center justify-center">
            <p className="body-3 text-gray-400 py-800">과제 이미지가 없습니다.</p>
          </div>
        )}

        {showImageModal && selectedImage && <ImageModal
          imageUrl={selectedImage?.url ?? ""}
          imageName={selectedImage?.name ?? ""}
          onClose={handleCloseImageModal}
        />}
      </div>}
    </div>
  );
});

export default AssignmentCard;

import { cn } from "../../../libs/utils";

const subjectInfo = {
  KOREAN: { label: "국어", style: "bg-green-100 text-green-500" },
  ENGLISH: { label: "영어", style: "bg-red-100 text-red-500" },
  MATH: { label: "수학", style: "bg-blue-100 text-blue-500" },
} as const;

export type Subject = keyof typeof subjectInfo;

interface SubjectBadgeProps {
  subject: Subject;
  className?: string;
}

const SubjectBadge = ({ subject, className }: SubjectBadgeProps) => {
  const { label, style } = subjectInfo[subject];
  return (
    <span
      className={cn("w-fit body-4 font-weight-700 px-100 py-1 rounded-900", style, className)}
      role="status"
      aria-label={`과목: ${label}`}
    >
      {label}
    </span>
  );
};

export default SubjectBadge;

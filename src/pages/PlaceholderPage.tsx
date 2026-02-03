/**
 * Nav/TabBar 링크용 플레이스홀더. 실제 페이지로 교체하면 됩니다.
 */
const PlaceholderPage = ({ name }: { name: string }) => (
  <div style={{ padding: 24, color: "var(--color-text-muted)" }}>
    {name} 페이지 (준비 중)
  </div>
);

export default PlaceholderPage;

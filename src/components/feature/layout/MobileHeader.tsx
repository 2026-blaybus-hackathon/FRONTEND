import openedBook from "../../../assets/opened-book.svg";
import Menu from "../../../icons/Menu";

const MobileHeader = ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
}: {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}) => {
  return (
    <>
      <div className="layout-dashboard-header mobile-header-root">
          <div className="mobile-header-inner">
            <div className="layout-nav__brand">
              <img src={openedBook} alt="Seolstudy" />
              <span className="layout-nav__brand-name heading-3">Seolstudy</span>
            </div>
            <MobileMenuToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>
        </div>

        {/* 사이드바 오버레이 (모바일) */}
        {isMobileMenuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
    </>
  );
};

const MobileMenuToggle = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        className="hamburger-btn"
        onClick={onClick}
        aria-label="메뉴 열기"
      >
        <Menu />
      </button>
    );
};

export default MobileHeader;
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { Toast } from "../components/common/toast/Toast";
import { ToastContainer } from "../components/common/toast/ToastContainer";
import { useToastStore } from "../stores/toastStore";
import type { ToastType } from "../stores/toastStore";
import Button from "../components/common/button/Button";
import "../App.css";

const meta = {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof Toast>;

const makeItem = (
  overrides: Partial<{ id: string; message: string; title?: string; type?: ToastType; createdAt: number; uri?: string }>
) => ({
  id: "toast-1",
  message: "메시지 내용입니다.",
  createdAt: Date.now(),
  ...overrides,
});

export const Info: Story = {
  args: {
    item: makeItem({ type: "info", title: "알림", message: "새 피드백이 도착했습니다." }),
    onClose: (id) => console.log("close", id),
  },
};

export const Success: Story = {
  args: {
    item: makeItem({
      type: "success",
      title: "완료",
      message: "저장이 완료되었습니다.",
    }),
    onClose: (id) => console.log("close", id),
  },
};

export const Warning: Story = {
  args: {
    item: makeItem({
      type: "warning",
      title: "주의",
      message: "제출 마감 30분 전입니다.",
    }),
    onClose: (id) => console.log("close", id),
  },
};

export const Error: Story = {
  args: {
    item: makeItem({
      type: "error",
      title: "오류",
      message: "요청을 처리할 수 없습니다.",
    }),
    onClose: (id) => console.log("close", id),
  },
};

export const MessageOnly: Story = {
  args: {
    item: makeItem({
      type: "info",
      message: "제목 없이 메시지만 표시할 수 있습니다.",
    }),
    onClose: (id) => console.log("close", id),
  },
};

/** ToastContainer + store: 버튼으로 토스트 추가 */
function ToastContainerDemo() {
  const addToast = useToastStore((s) => s.addToast);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="primary"
          ariaLabel="info 토스트"
          onClick={() =>
            addToast({
              type: "info",
              title: "알림",
              message: "SSE로 받은 알림입니다.",
            })
          }
        >
          Info 토스트
        </Button>
        <Button
          variant="primary"
          ariaLabel="success 토스트"
          onClick={() =>
            addToast({
              type: "success",
              title: "완료",
              message: "저장되었습니다.",
            })
          }
        >
          Success 토스트
        </Button>
        <Button
          variant="primary"
          ariaLabel="warning 토스트"
          onClick={() =>
            addToast({
              type: "warning",
              message: "마감이 임박했습니다.",
            })
          }
        >
          Warning 토스트
        </Button>
        <Button
          variant="primary"
          ariaLabel="error 토스트"
          onClick={() =>
            addToast({
              type: "error",
              title: "오류",
              message: "다시 시도해 주세요.",
            })
          }
        >
          Error 토스트
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

export const WithContainer: StoryObj = {
  render: () => <ToastContainerDemo />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "버튼을 눌러 토스트를 추가해 보세요. ToastContainer가 우측 상단에 토스트를 표시합니다.",
      },
    },
  },
};

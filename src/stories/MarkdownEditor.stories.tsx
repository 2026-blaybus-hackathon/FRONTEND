import type { Meta, StoryObj } from '@storybook/react-vite';
import MarkdownEditor from '../components/common/MarkdownEditor';
import '../App.css';
import { useState } from 'react';

const meta = {
  title: 'Common/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    setValue: () => {},
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    return <MarkdownEditor value={value} setValue={setValue} />;
  },
};

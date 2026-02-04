import type { Meta, StoryObj } from '@storybook/react-vite';
import IconButton from '../components/common/button/IconButton';
import '../App.css';
import { ArrowLeft } from 'lucide-react';

const meta = {
  title: 'Common/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    ariaLabel: 'Primary Button',
    Icon: ArrowLeft
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: "primary",
    ariaLabel: 'Disabled Button',
    Icon: ArrowLeft
  },
};
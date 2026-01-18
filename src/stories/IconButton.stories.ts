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

export const TransparentPrimary: Story = {
  args: {
    variant: "transparent-primary",
    ariaLabel: 'Transparent Primary Button',
    Icon: ArrowLeft
  },
};

export const TransparentGray: Story = {
  args: {
    variant: "transparent-gray",
    ariaLabel: 'Transparent Gray Button',
    Icon: ArrowLeft
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: "transparent-gray",
    ariaLabel: 'Disabled Button',
    Icon: ArrowLeft
  },
};
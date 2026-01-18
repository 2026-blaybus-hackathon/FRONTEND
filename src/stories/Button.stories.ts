import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '../components/common/button/Button';
import '../App.css';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: "primary",
    ariaLabel: 'Primary Button',
    children: "Primary Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    ariaLabel: 'Outlined Button',
    children: "Outlined Button",
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: "primary",
    ariaLabel: 'Large Button',
    children: "Large Button",
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: "primary",
    ariaLabel: 'Small Button',
    children: "Small Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: "primary",
    ariaLabel: 'Disabled Button',
    children: "Disabled Button",
  },
};
import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from '../components/common/input/Input';
import EmailInput from '../components/common/input/EmailInput';
import PasswordInput from '../components/common/input/PasswordInput';
import '../App.css';
import { useState } from 'react';

const meta = {
  title: 'Common/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "input"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    return (
        <Input value={value} onChange={handleInput} ariaLabel="input" />
    )
  }
};

export const Email: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "input"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    return (
        <EmailInput value={value} onChange={handleInput} ariaLabel="input" />
    )
  }
};

export const Password: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "input"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    return (
        <PasswordInput value={value} onChange={handleInput} ariaLabel="input" />
    )
  }
};
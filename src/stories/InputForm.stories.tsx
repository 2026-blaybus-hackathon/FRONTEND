import type { Meta, StoryObj } from '@storybook/react-vite';
import '../App.css';
import { useState } from 'react';
import InputForm from '../components/common/form/InputForm';

const meta = {
  title: 'Common/InputForm',
  component: InputForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "text input form",
    title: "Default",
    type: "text",
    error: "",
    success: ""
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};

export const TextError: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "text input form",
    title: "Default",
    type: "text",
    error: "error warning!",
    success: ""
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};

export const TextSuccess: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "text input form",
    title: "Default",
    type: "text",
    error: "",
    success: "successed!"
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};

export const TextReadOnly: Story = {
  args: {
    value: "readonly",
    onChange: () => {},
    ariaLabel: "readonly input form",
    title: "Default",
    type: "text",
    error: "",
    success: "",
    readOnly: true
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>(args.value);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};

export const Email: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "email input form",
    title: "Email",
    type: "email",
    error: "",
    success: ""
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};

export const Password: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "password input form",
    title: "Password",
    type: "password",
    error: "",
    success: ""
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputForm
        {...args}
        value={value}
        onChange={handleInput}
      />
    );
  }
};
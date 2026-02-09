import type { Meta, StoryObj } from '@storybook/react-vite';
import TextArea from '../components/common/input/TextArea';
import '../App.css';
import { useState } from 'react';

const meta = {
  title: 'Common/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          placeholder="학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요"
          ariaLabel="textarea" 
        />
      </div>
    )
  }
};

export const Outlined: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          variant="outlined"
          placeholder="학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요"
          ariaLabel="textarea" 
        />
      </div>
    )
  }
};

export const Large: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          size="lg"
          rows={6}
          placeholder="학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요"
          ariaLabel="textarea" 
        />
      </div>
    )
  }
};

export const WithMaxLength: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          maxLength={200}
          placeholder="학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요"
          ariaLabel="textarea" 
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#767676' }}>
          {value.length} / 200
        </p>
      </div>
    )
  }
};

export const ReadOnly: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value] = useState<string>("읽기 전용 텍스트입니다. 수정할 수 없습니다.")
    const handleChange = () => {
      // readonly이므로 변경되지 않음
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          readOnly
          ariaLabel="textarea" 
        />
      </div>
    )
  }
};

export const WithError: Story = {
  args: {
    value: "",
    onChange: () => {},
    ariaLabel: "textarea"
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }

    return (
      <div style={{ width: '600px' }}>
        <TextArea 
          value={value} 
          onChange={handleChange} 
          variant="outlined"
          isError={true}
          placeholder="학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요"
          ariaLabel="textarea" 
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#D54049' }}>
          필수 입력 항목입니다.
        </p>
      </div>
    )
  }
};

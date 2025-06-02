import { Form, Input, Modal } from "antd";
import { FC } from "react";

interface CreateTemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: { name: string; schema: string }) => void;
}

export const TemplateForm: FC<CreateTemplateModalProps> = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: { name: string; schema: string }) => {
    onCreate(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Create Template"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Create"
      cancelText="Cancel"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: "", schema: "" }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the template name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Schema"
          name="schema"
          rules={[{ required: true, message: "Please input the schema!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

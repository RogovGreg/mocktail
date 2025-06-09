import { TTemplate } from "#api";
import { Form, Input, Modal } from "antd";
import { FC } from "react";

interface CreateTemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: TTemplate) => void;
  template: TTemplate;
}

export const TemplateForm: FC<CreateTemplateModalProps> = ({ open, onCancel, onCreate, template }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: TTemplate) => {
    onCreate(values);
    form.resetFields();
  };

  return (
    <Modal
      title={template.id ? "Edit Template" : "Create Template"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={template.id ? "Update" : "Create"}
      cancelText="Cancel"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={template}
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

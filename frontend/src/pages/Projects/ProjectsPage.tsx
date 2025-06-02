import { BackendService, TTemplate } from "#api";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { TemplateForm } from "./TemplateForm";

const MockTemplates: TTemplate[] = [
  {
    id: "1",
    name: "Template 1",
    schema: "Schema 1",
    projectId: "1",
  },
  {
    id: "2",
    name: "Template 2",
    schema: "Schema 2",
    projectId: "1",
  },
];

export const ProjectsPage = () => {
  const [templates, setTemplates] = useState<TTemplate[]>(MockTemplates);
  const [showTemplateForm, setTemplateForm] = useState(false);

  const fetchTemplates = async () =>
    BackendService.getTemplates().then((res) => setTemplates(res));

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateClick = () => setTemplateForm(true);
  const handleCancel = () => setTemplateForm(false);

  const handleFormSubmit = (values: { name: string; schema: string }) => {
    BackendService.creteTemplate({
      name: values.name,
      schema: values.schema,
      projectId: "1",
    });
    // TODO Confirm creation then update state
    setTemplates([
      ...templates,
      {
        id: (templates.length + 1).toString(),
        name: values.name,
        schema: values.schema,
        projectId: "1",
      },
    ]);
    setTemplateForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>
      <h3>Templates</h3>
      <ul>
        {templates.map((template, index) => (
          <li key={index}>
            <h2>{template.name}</h2>
            <p>{template.schema}</p>
          </li>
        ))}
        <li>
          <Button onClick={handleCreateClick}>Create template</Button>
        </li>
      </ul>
      <TemplateForm
        open={showTemplateForm}
        onCancel={handleCancel}
        onCreate={handleFormSubmit}
      />
    </div>
  );
};

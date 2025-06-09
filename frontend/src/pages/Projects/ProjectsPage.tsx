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
  const [activeTemplate, setActiveTemplate] = useState<TTemplate | undefined>(
    undefined
  );

  const fetchTemplates = async () =>
    BackendService.getTemplates().then((res) => setTemplates(res));

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openTemplateForm = (template?: TTemplate) => {
    setActiveTemplate(
      template || { id: "", name: "", schema: "", projectId: "" }
    );
  };
  const closeTemplateForm = () => setActiveTemplate(undefined);

  const handleCreateTemplate = (values: TTemplate) => {
    BackendService.creteTemplate({
      name: values.name,
      schema: values.schema,
      projectId: "1",
    });
    setTemplates([
      ...templates,
      {
        id: (templates.length + 1).toString(),
        name: values.name,
        schema: values.schema,
        projectId: "1",
      },
    ]);
  };

  const handleUpdateTemplate = (values: TTemplate) => {
    if (!activeTemplate?.id) return;

    BackendService.updateTemplate(activeTemplate.id, {
      id: activeTemplate.id,
      name: values.name,
      schema: values.schema,
      projectId: "1",
    });

    setTemplates(
      templates.map((template) =>
        template.id === activeTemplate.id
          ? { ...template, name: values.name, schema: values.schema }
          : template
      )
    );
  };

  const handleFormSubmit = (values: TTemplate) => {
    if (activeTemplate?.id) {
      handleUpdateTemplate(values);
    } else {
      handleCreateTemplate(values);
    }
    closeTemplateForm();
  };

  const handleDelete = (templateId: string) => {
    BackendService.deleteTemplate(templateId);
    setTemplates(templates.filter((template) => template.id !== templateId));
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
            <Button onClick={() => openTemplateForm(template)}>Edit</Button>
            <Button
              onClick={() =>
                handleDelete(
                  template.id || "TODO: Change this to something better"
                )
              }
            >
              Delete
            </Button>
          </li>
        ))}
        <li>
          <Button onClick={() => openTemplateForm()}>Create template</Button>
        </li>
      </ul>
      <TemplateForm
        open={activeTemplate !== undefined}
        onCancel={closeTemplateForm}
        onCreate={handleFormSubmit}
        template={activeTemplate}
      />
    </div>
  );
};

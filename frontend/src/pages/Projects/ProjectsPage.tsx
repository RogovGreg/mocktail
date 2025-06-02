import { BackendService, TTemplate } from "#api";
import { useEffect, useState } from "react";

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
]



export const ProjectsPage = () => {
  const [templates, setTemplates] = useState<TTemplate[]>(MockTemplates);

  const fetchTemplates = async () =>
    BackendService.getTemplates().then((res) => setTemplates(res));

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>
      <h3>Templates</h3>
      <ul>
        {templates.map((template, index) => (
          <li key={index}> {/* TODO Change to template id */ }
            <h2>{template.name}</h2>
            <p>{template.schema}</p>
          </li>
        ))}
        <li><button>Create template</button></li>
      </ul>
    </div>
  );
};

import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Button } from 'antd';

import { BackendService, TTemplate } from '#api';

export const TemplatePage: FC = () => {
  const { templateId } = useParams();

  const [template, setTemplate] = useState<TTemplate | null>(null);

  useEffect(() => {
    if (templateId) {
      BackendService.getTemplateByID({
        path: { params: { id: String(templateId) } },
      })
        .then(response => {
          setTemplate(response.data);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch template', error);
        });
    }
  }, [templateId]);

  const templateData = useMemo<ReactNode>(() => {
    let body: ReactNode = null;
    if (!template) {
      body = <p>Loading template...</p>;
    } else {
      body = (
        <ul>
          <li>
            <strong>ID:</strong> {template.id}
          </li>
          <li>
            <strong>Name:</strong> {template.name}
          </li>
          <li>
            <strong>Tags:</strong> {template.tags?.join(', ') || 'None'}
          </li>
          <li>
            <strong>Path:</strong> {template.path || 'No path'}
          </li>
          <li>
            <strong>Description:</strong>{' '}
            {template.description || 'No description'}
          </li>
          <li>
            <strong>Related Project ID:</strong> {template.relatedProjectId}
          </li>
          <li>
            <strong>Updated At:</strong> {template.updatedAt}
          </li>
          <li>
            <strong>Used In:</strong> {template.usedIn?.join(', ') || 'None'}
          </li>
          <li>
            <strong>Schema:</strong> <pre>{template.schema}</pre>
          </li>
        </ul>
      );
    }

    return (
      <div>
        <h2>{template?.name || 'Template'}</h2>
        {body}
      </div>
    );
  }, [template]);

  return (
    <div>
      {templateData}
      <Button
        type='primary'
        onClick={() => {
          if (templateId) {
            BackendService.generateDataByTemplateID({
              path: { params: { id: String(templateId) } },
            })
              .then(response => {
                // eslint-disable-next-line no-console
                console.log('Generated data:', response.data);
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.error('Failed to generate data', error);
              });
          }
        }}
      >
        Generate Data And Show The Result In The Console
      </Button>
    </div>
  );
};

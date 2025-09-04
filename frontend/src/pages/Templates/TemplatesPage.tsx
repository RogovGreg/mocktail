import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Form, Input, Table } from 'antd';

import { BackendService, TTemplate } from '#api';

import { TFilterTemplateFormValues } from './types';

export const TemplatesPage: FC = () => {
  const { projectId } = useParams();

  const navigate = useNavigate();

  const [templates, setTemplates] = useState<Array<TTemplate> | null>(null);

  useEffect(() => {
    if (projectId) {
      BackendService.getTemplatesList({
        query: { params: { relatedProjectId: projectId } },
      })
        .then(response => {
          setTemplates(response.data);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch templates', error);
        });
    }
  }, [projectId]);

  const onFinish = (values: TFilterTemplateFormValues) => {
    const {
      createdAt,
      createdBy,
      id,
      searchString,
      updatedAt,
      updatedBy,
      usedIn,
    } = values || {};

    BackendService.getTemplatesList({
      query: {
        params: {
          createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
          createdBy,
          id,
          relatedProjectId: projectId,
          searchString,
          updatedAt: updatedAt ? new Date(updatedAt).toISOString() : undefined,
          updatedBy,
          usedIn,
        },
      },
    }).then(response => {
      setTemplates(response.data);
    });
  };

  return (
    <div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1>Templates</h1>
        <Button
          onClick={() =>
            navigate(`/app/projects/${projectId}/templates/create`)
          }
        >
          Create New Template
        </Button>
      </div>

      <Form<TFilterTemplateFormValues>
        onFinish={onFinish}
        layout='inline'
        style={{ marginBottom: 20 }}
      >
        <Form.Item label='Search' name='searchString'>
          <Input type='text' placeholder='Search templates...' />
        </Form.Item>
        <Form.Item label='Created At' name='createdAt'>
          <Input type='datetime-local' />
        </Form.Item>
        <Form.Item label='Updated At' name='updatedAt'>
          <Input type='datetime-local' />
        </Form.Item>
        <Form.Item label='Created By' name='createdBy'>
          <Input type='text' placeholder='Creator ID...' />
        </Form.Item>
        <Form.Item label='Updated By' name='updatedBy'>
          <Input type='text' placeholder='Updater ID...' />
        </Form.Item>
        <Form.Item label='Used In' name='usedIn'>
          <Input type='text' placeholder='Used In...' />
        </Form.Item>
        <Form.Item label='ID' name='id'>
          <Input type='text' placeholder='ID...' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Search
          </Button>
        </Form.Item>
      </Form>

      <Table<TTemplate>
        dataSource={templates || []}
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
          },
          {
            dataIndex: 'description',
            key: 'description',
            title: 'Description',
          },
          {
            dataIndex: 'action',
            key: 'action',
            title: 'Action',

            render: (_, record) => (
              <>
                <Button
                  onClick={() =>
                    navigate(
                      `/app/projects/${projectId}/templates/${record.id}`,
                    )
                  }
                >
                  View
                </Button>
                <Button
                  onClick={() =>
                    navigate(
                      `/app/projects/${projectId}/templates/${record.id}/edit`,
                    )
                  }
                >
                  Edit
                </Button>
                <Button
                  danger
                  onClick={() =>
                    BackendService.deleteTemplate({
                      path: { params: { id: record.id } },
                    })
                  }
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

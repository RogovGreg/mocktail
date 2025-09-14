import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input } from 'antd';

import { BackendService } from '#api';
import { TProject } from '#api/services/BackendService/types';
import { ERoutes } from '#src/router';

import { TProjectFiltersFormValues } from './types';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    BackendService.getProjectsList()
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch projects', error);
      });
  }, []);

  const handleDeleteProject = (projectId: string) => {
    BackendService.deleteProject({ path: { params: { id: projectId } } })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to delete project', error);
      });
  };

  const onSearch = useCallback((values: TProjectFiltersFormValues): void => {
    const { searchString, updatedAt, createdAt, updatedBy, createdBy, member } =
      values || {};

    BackendService.getProjectsList({
      query: {
        params: {
          createdAt,
          createdBy,
          member,
          searchString,
          updatedAt,
          updatedBy,
        },
      },
    })
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch projects', error);
      });
  }, []);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: '20px',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1>Projects Page</h1>

        <Button onClick={() => navigate(ERoutes.ProjectCreate)}>
          Create New Project
        </Button>
      </div>
      <div>
        <Form<TProjectFiltersFormValues> layout='inline' onFinish={onSearch}>
          <Form.Item
            name='searchString'
            label='Search (by project ID, title or key words)'
          >
            <Input placeholder='Search projects...' />
          </Form.Item>
          <Form.Item name='member' label='Search by Member'>
            <Input placeholder='Member' />
          </Form.Item>
          <Form.Item name='createdBy' label='Search by Created By'>
            <Input placeholder='Created By' />
          </Form.Item>
          <Form.Item name='updatedBy' label='Search by Updated By'>
            <Input placeholder='Updated By' />
          </Form.Item>
          <Form.Item name='createdAt' label='Search by Created At'>
            <Input placeholder='Created At' />
          </Form.Item>
          <Form.Item name='updatedAt' label='Search by Updated At'>
            <Input placeholder='Updated At' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Search
          </Button>
        </Form>
      </div>
      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.title} - {project.description}
              <Button onClick={() => navigate(`/app/projects/${project.id}`)}>
                View
              </Button>
              <Button
                onClick={() => navigate(`/app/projects/${project.id}/edit`)}
              >
                Edit
              </Button>
              <Button danger onClick={() => handleDeleteProject(project.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

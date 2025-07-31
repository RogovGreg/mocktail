import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { BackendService } from '#api';
import { TProject } from '#api/services/BackendService/types';
import { ERoutes } from '#src/router';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    BackendService.getProjectsList()
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch projects', error);
      });
  }, []);

  const handleDeleteProject = (projectId: string) => {
    BackendService.deleteProject({ Id: projectId })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => {
        console.error('Failed to delete project', error);
      });
  };

  return (
    <div>
      <h1>Projects Page</h1>

      <button
        type='button'
        onClick={() => {
          navigate(ERoutes.ProjectCreate);
        }}
      >
        Create New Project
      </button>

      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.title} - {project.description}
              <button
                type='button'
                onClick={() =>
                  navigate(ERoutes.ProjectView.replace(':id', project.id))
                }
              >
                View
              </button>
              <button
                type='button'
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

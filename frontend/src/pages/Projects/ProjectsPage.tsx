import { BackendService} from '#api';
import { useEffect, useState } from 'react';
import { TProject } from '#api/services/BackendService/types';
import { useNavigate } from 'react-router';
import { ERoutes } from '#src/router';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    BackendService.getProjectsList().then(response => {
      setProjects(response.data);
    }).catch(error => {
      console.error('Failed to fetch projects', error);
    });
  }, []);

  const handleDeleteProject = (projectId: string) => {
    BackendService.deleteProject({ Id: projectId })
      .then(() => {
        setProjects(projects.filter(project => project.Id !== projectId));
      })
      .catch(error => {
        console.error('Failed to delete project', error);
      });
  };

  return (
    <div>
      <h1>Projects Page</h1>

      <button onClick={() => {
        navigate(ERoutes.ProjectCreate);
      }}>Create New Project</button>

      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.Id}>
              {project.Title} - {project.Description}
              <button onClick={() => navigate(ERoutes.ProjectView.replace(':id', project.Id))}>
                View
              </button>
              <button onClick={() => handleDeleteProject(project.Id)}>
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
}
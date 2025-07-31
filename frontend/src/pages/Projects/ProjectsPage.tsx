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

  return (
    <div>
      <h1>Projects Page</h1>

      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project.Id}>
              <button onClick={() => navigate(ERoutes.ProjectView.replace(':id', project.Id))}>
                {project.Title} - {project.Description}
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
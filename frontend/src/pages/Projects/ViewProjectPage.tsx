import { BackendService, TProject } from "#api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const ViewProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<TProject | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('Project ID is required');
      return;
    }
    
    BackendService.getProjectByID({ Id: id }, null).then(response => {
      setProject(response.data);
    }).catch(error => {
      console.error('Failed to fetch project', error);
    });
  }, [id]);

  return (
    <div>
      <h1>View Project</h1>
      {project ? (
        <div>
          <h2>{project.Title}</h2>
          <p>{project.Description || 'No description'}</p>
        </div>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
};

import { FormEvent } from 'react';

import { BackendService, TCreateTemplateAPIMethodPayload } from '#api';

export const TemplatesDemoPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const formData = new FormData(event.target);
    const values: TCreateTemplateAPIMethodPayload = {
      Description: String(formData.get('description')),
      KeyWords: String(formData.get('keyWords'))
        ?.split(',')
        .map(item => item.trim()),
      Name: String(formData.get('name')),
      RelatedProjectId: String(formData.get('relatedProjectID')),
      Schema: String(formData.get('schema')),
    };

    BackendService.createTemplate(null, values);

    console.log(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
    >
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        Name
        <input type='text' name='name' />
      </span>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        Description
        <input type='text' name='description' />
      </span>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        Key Words (separate by comma &quot;,&quot;)
        <input type='text' name='keyWords' />
      </span>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        Schema
        <textarea name='schema' />
      </span>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        Related Project ID
        <input type='text' name='relatedProjectID' />
      </span>
      <button type='submit'>Create</button>
    </form>
  );
};

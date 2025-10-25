import { FC } from 'react';

export const LandingPage: FC = () => (
  <div className='flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 py-8'>
    <div className='container mx-auto px-6 max-w-4xl'>
      <div className='text-center space-y-8'>
        <div className='space-y-6 text-base-content/90'>
          <p className='text-xl md:text-2xl leading-relaxed font-light'>
            MockTail is a web application that generates realistic mock data
            from TypeScript templates—fast, type-safe, and without waiting for
            the backend. It speeds up interface prototyping, decouples frontend
            development from the backend, helps QA prepare reliable scenarios
            for automated tests, and lets product teams deliver convincing demos
            without using production data.
          </p>

          <div className='divider divider-primary opacity-30 my-4' />

          <p className='text-lg md:text-xl leading-relaxed font-light'>
            The data is available via easy API calls: in your project, just
            change the request endpoint and include an API token. Create
            templates (and group them into projects), plug in your TypeScript
            types, add comments describing your data requirements, and get
            AI-generated responses in JSON format—ready for local development.
          </p>
        </div>

        <div className='pt-4 space-y-4'>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <a
              href='/register'
              className='btn btn-primary btn-lg text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300'
            >
              Get started
            </a>
          </div>

          <p className='text-sm text-base-content/50'>Free for everyone</p>
        </div>
      </div>
    </div>
  </div>
);

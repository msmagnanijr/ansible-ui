import { CreateJobTemplate } from './TemplateForm';

describe('Create job template ', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/labels/*',
        hostname: 'localhost',
      },
      {
        fixture: 'labels.json',
      }
    ).as('labelsFetched');
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/projects/*',
        hostname: 'localhost',
      },
      {
        fixture: 'projects.json',
      }
    );
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/credential_types/*',
        hostname: 'localhost',
      },
      {
        fixture: 'credential_types.json',
      }
    );
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/credentials/*',
        hostname: 'localhost',
      },
      {
        fixture: 'credentials.json',
      }
    );
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/instance_groups/*',
        hostname: 'localhost',
      },
      {
        fixture: 'instance_groups.json',
      }
    );
    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/projects/6/playbooks/',
        hostname: 'localhost',
      },
      {
        fixture: 'playbooks.json',
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/inventories/*',
        hostname: 'localhost',
      },
      {
        fixture: 'inventories.json',
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: '/api/v2/execution_environments/*',
        hostname: 'localhost',
      },
      {
        fixture: 'execution_environments.json',
      }
    );

    cy.intercept(
      { method: 'POST', url: '/api/v2/projects/*', hostname: 'localhost' },
      { fixture: 'project.json' }
    ).as('selectedProject');
  });
  it('Create Template - Displays error message on internal server error', () => {
    cy.mount(<CreateJobTemplate />);
    cy.get('[data-cy="name"]').type('Test');
  });

  it('Component renders', () => {
    cy.mount(<CreateJobTemplate />);
    cy.verifyPageTitle('Create Job Template');
  });
  it('Validates properly', () => {
    cy.mount(<CreateJobTemplate />);
    cy.clickButton(/^Create job template$/);
    ['Name', 'Inventory', 'Project', 'Playbook'].map((field) =>
      cy.contains(`${field} is required.`).should('be.visible')
    );
  });
  it('Should update fields properly', () => {
    cy.mount(<CreateJobTemplate />);
    cy.get('[data-cy="name"]').type('Test');
    cy.get('button[aria-describedby="job_type-form-group"]').click();
    cy.clickButton(/^Check$/);
    cy.selectDropdownOptionByResourceName('inventory', 'Demo Inventory');
    cy.selectDropdownOptionByResourceName('project', 'Demo Project').as('ProjectInput');
    cy.selectDropdownOptionByResourceName('playbook', 'hello_world.yml');
    cy.clickButton('Create job template');

    cy.intercept('POST', '/api/v2/job_templates/', (req) => {
      expect(req.body).to.contain({
        inventory: 9,
        job_type: 'check',
        name: 'Test',
        playbook: 'hello_world.yml',
        project: 6,
      });
    });
  });
});

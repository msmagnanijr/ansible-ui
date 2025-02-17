import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  LabelGroup,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  DateTimeCell,
  PageDetail,
  PageDetails,
  PageHeader,
  PageLayout,
  Scrollable,
  useGetPageUrl,
} from '../../../../framework';
import { useGet } from '../../../common/crud/useGet';
import { EdaRoute } from '../../EdaRoutes';
import { SWR_REFRESH_INTERVAL } from '../../constants';
import { EdaRole } from '../../interfaces/EdaRole';
import { edaAPI } from '../../api/eda-utils';

export function RoleDetails() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { data: role } = useGet<EdaRole>(edaAPI`/roles/${params.id ?? ''}/`, undefined, {
    refreshInterval: SWR_REFRESH_INTERVAL,
  });
  const ResourceTypes = {
    activation: t('Activation'),
    activation_instance: t('Activation Instance'),
    audit_rule: t('Audit Rule'),
    audit_event: t('Audit Event'),
    task: t('Task'),
    user: t('User'),
    project: t('Project'),
    inventory: t('Inventory'),
    extra_var: t('Extra Vars'),
    playbook: t('Playbook'),
    rulebook: t('Rulebook'),
    role: t('Role'),
    decision_environment: t('Decision environment'),
    credential: t('Credential'),
  };

  const getPageUrl = useGetPageUrl();

  return (
    <PageLayout>
      <PageHeader
        title={role?.name}
        breadcrumbs={[{ label: t('Roles'), to: getPageUrl(EdaRoute.Roles) }, { label: role?.name }]}
      />
      <Scrollable>
        <PageDetails>
          <PageDetail label={t('Name')}>{role?.name || ''}</PageDetail>
          <PageDetail label={t('Description')}>{role?.description || ''}</PageDetail>
          <PageDetail label={t('Created')}>
            <DateTimeCell format="date-time" value={role?.created_at} />
          </PageDetail>
        </PageDetails>
        <PageDetails numberOfColumns={'single'}>
          <PageDetail label={t('Permissions')}>
            <DescriptionList
              isCompact
              isHorizontal
              horizontalTermWidthModifier={{
                default: '16ch',
              }}
            >
              {role?.permissions.map((permission) => (
                <DescriptionListGroup key={permission?.resource_type}>
                  <DescriptionListTerm
                    data-cy={'permissions'}
                    style={{ fontWeight: 'normal' }}
                    key={permission?.resource_type}
                  >
                    {ResourceTypes[permission?.resource_type] || permission?.resource_type}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {!!permission?.action.length && (
                      <LabelGroup numLabels={5}>
                        {permission?.action.map((action) => <Label key={action}>{action}</Label>)}
                      </LabelGroup>
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>
          </PageDetail>
        </PageDetails>
      </Scrollable>
    </PageLayout>
  );
}

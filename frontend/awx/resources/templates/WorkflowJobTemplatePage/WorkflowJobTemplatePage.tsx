/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  PageActions,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  usePageNavigate,
} from '../../../../../framework';
import { LoadingPage } from '../../../../../framework/components/LoadingPage';
import { useGet, useGetItem } from '../../../../common/crud/useGet';
import { useActiveUser } from '../../../../common/useActiveUser';
import { AwxRoute } from '../../../AwxRoutes';
import { awxAPI } from '../../../api/awx-utils';
import { AwxError } from '../../../common/AwxError';
import { AwxItemsResponse } from '../../../common/AwxItemsResponse';
import { Organization } from '../../../interfaces/Organization';
import { WorkflowJobTemplate } from '../../../interfaces/WorkflowJobTemplate';
import { useTemplateActions } from '../hooks/useTemplateActions';
import { PageRoutedTabs } from '../../../../../framework/PageTabs/PageRoutedTabs';
import { useMemo } from 'react';

export function WorkflowJobTemplatePage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const currentUser = useActiveUser();
  const {
    error: templateError,
    data: template,
    isLoading: isTemplateLoading,
    refresh,
  } = useGetItem<WorkflowJobTemplate>(awxAPI`/workflow_job_templates`, params.id);

  const {
    data: isNotifAdmin,
    error: isNotifAdminError,
    refresh: refreshNotifAdmin,
    isLoading: isNotifAdminLoading,
  } = useGet<AwxItemsResponse<Organization>>(
    awxAPI`/organizations/?role_level=notification_admin_role`
  );
  const getPageUrl = useGetPageUrl();
  const pageNavigate = usePageNavigate();
  const itemActions = useTemplateActions({
    onTemplatesDeleted: () => pageNavigate(AwxRoute.Templates),
  });
  const error = isNotifAdminError || templateError;

  const tabs: ({ label: string; page: string } | false)[] = useMemo(
    () => [
      { label: t('Details'), page: AwxRoute.WorkflowJobTemplateDetails },
      { label: t('Access'), page: AwxRoute.WorkflowJobTemplateAccess },
      { label: t('Schedules'), page: AwxRoute.WorkflowJobTemplateSchedules },
      { label: t('Jobs'), page: AwxRoute.WorkflowJobTemplateJobs },
      { label: t('Survey'), page: AwxRoute.WorkflowJobTemplateSurvey },
      currentUser?.is_system_auditor || (isNotifAdmin && isNotifAdmin.results.length > 0)
        ? { label: t('Notifications'), page: AwxRoute.WorkflowJobTemplateNotifications }
        : false,
    ],

    [t, currentUser, isNotifAdmin]
  );

  if (error) return <AwxError error={error} handleRefresh={refresh || refreshNotifAdmin} />;
  if (!template || isTemplateLoading || isNotifAdminLoading)
    return <LoadingPage breadcrumbs tabs />;

  return (
    <PageLayout>
      <PageHeader
        title={template?.name}
        breadcrumbs={[
          { label: t('Templates'), to: getPageUrl(AwxRoute.Templates) },
          { label: template?.name },
        ]}
        headerActions={
          <PageActions<WorkflowJobTemplate>
            actions={itemActions}
            position={DropdownPosition.right}
            selectedItem={template}
          />
        }
      />
      <PageRoutedTabs
        backTab={{
          label: t('Back to Templates'),
          page: AwxRoute.Templates,
          persistentFilterKey: 'templates',
        }}
        tabs={tabs}
        params={{ id: template.id }}
      />
    </PageLayout>
  );
}

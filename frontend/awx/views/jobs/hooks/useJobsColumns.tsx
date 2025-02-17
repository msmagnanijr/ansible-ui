import { Chip, ChipGroup, LabelGroup } from '@patternfly/react-core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ColumnModalOption,
  ColumnTableOption,
  DateTimeCell,
  ITableColumn,
  TextCell,
} from '../../../../../framework';
import { ElapsedTimeCell } from '../../../../../framework/PageCells/ElapsedTimeCell';
import { RouteObj } from '../../../../common/Routes';
import { StatusCell } from '../../../../common/Status';
import { useOptions } from '../../../../common/crud/useOptions';
import { CredentialLabel } from '../../../common/CredentialLabel';
import { ActionsResponse, OptionsResponse } from '../../../interfaces/OptionsResponse';
import { UnifiedJob } from '../../../interfaces/UnifiedJob';
import { awxAPI } from '../../../api/awx-utils';
import { getJobOutputUrl, getLaunchedByDetails, getScheduleUrl, isJobRunning } from '../jobUtils';

export function useJobsColumns(options?: { disableSort?: boolean; disableLinks?: boolean }) {
  const { t } = useTranslation();

  const { data } = useOptions<OptionsResponse<ActionsResponse>>(awxAPI`/inventory_sources/`);
  const inventorySourceChoices = useMemo(
    () =>
      data &&
      data.actions &&
      data.actions['GET'] &&
      data.actions['GET'].source &&
      Array.isArray(data.actions['GET'].source.choices)
        ? data.actions['GET'].source.choices
        : [],
    [data]
  );

  const tableColumns = useMemo<ITableColumn<UnifiedJob>[]>(
    () => [
      {
        header: t('ID'),
        cell: (job: UnifiedJob) => job.id,
        sort: 'id',
        card: 'hidden',
        list: 'hidden',
        minWidth: 0,
      },
      {
        header: t('Name'),
        cell: (job: UnifiedJob) => {
          return (
            <TextCell
              text={job.name}
              to={getJobOutputUrl(job)}
              disableLinks={options?.disableLinks}
            />
          );
        },
        sort: 'name',
        card: 'name',
        list: 'name',
      },
      {
        header: t('Status'),
        cell: (job: UnifiedJob) => <StatusCell status={job.status} />,
        sort: 'status',
      },
      {
        header: t('Type'),
        cell: (job: UnifiedJob) => {
          const jobTypes: { [key: string]: string } = {
            project_update: t`Source control update`,
            inventory_update: t`Inventory sync`,
            job: job.job_type === 'check' ? t`Playbook check` : t`Playbook run`,
            ad_hoc_command: t`Command`,
            system_job: t`Management job`,
            workflow_job: t`Workflow job`,
          };
          return <TextCell text={jobTypes[job.type]} />;
        },
        sort: 'type',
        card: 'subtitle',
        list: 'subtitle',
      },
      {
        header: t('Duration'),
        cell: (job: UnifiedJob) =>
          job.started && <ElapsedTimeCell start={job.started} finish={job.finished} />,
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Started'),
        cell: (job: UnifiedJob) =>
          job.started && <DateTimeCell format="date-time" value={job.started} />,
        sort: 'started',
        list: 'secondary',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Finished'),
        cell: (job: UnifiedJob) =>
          job.finished && <DateTimeCell format="date-time" value={job.started} />,
        sort: 'finished',
        card: 'hidden',
        list: 'secondary',
        defaultSortDirection: 'desc',
        defaultSort: true,
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Source'),
        cell: (job: UnifiedJob) =>
          inventorySourceChoices?.map(([string, label]) => (string === job.source ? label : null)),
        value: (job: UnifiedJob) => !!job.source,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Launched by'),
        cell: (job: UnifiedJob) => {
          const { value: launchedByValue, link: launchedByLink } = getLaunchedByDetails(job) ?? {};
          if (launchedByLink) {
            return <Link to={`${launchedByLink}`}>{launchedByValue}</Link>;
          } else {
            return launchedByValue;
          }
        },
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Schedule'),
        cell: (job: UnifiedJob) => (
          <Link to={job.summary_fields?.schedule ? getScheduleUrl(job) ?? '' : ''}>
            {job.summary_fields?.schedule?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => job.summary_fields?.schedule?.name,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Job template'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.JobTemplateDetails.replace(
              ':id',
              job.summary_fields?.job_template?.id.toString() ?? ''
            )}
          >
            {job.summary_fields?.job_template?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.job_template,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Workflow job template'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.WorkflowJobTemplateDetails.replace(
              ':id',
              job.summary_fields?.workflow_job_template?.id.toString() ?? ''
            )}
          >
            {job.summary_fields?.workflow_job_template?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.workflow_job_template,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Source workflow job'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.JobDetails.replace(':job_type', 'workflow').replace(
              ':id',
              job.summary_fields.source_workflow_job?.id.toString() ?? ''
            )}
          >
            {job.summary_fields.source_workflow_job?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.source_workflow_job,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Inventory'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.InventoryDetails.replace(
              ':inventory_type',
              inventoryUrlPaths[job.summary_fields?.inventory?.kind ?? '']
            ).replace(':id', job.summary_fields?.inventory?.id.toString() ?? '')}
          >
            {job.summary_fields?.inventory?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.inventory,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Project'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.ProjectDetails.replace(
              ':id',
              job.summary_fields?.project?.id.toString() ?? ''
            )}
          >
            {job.summary_fields?.project?.name}
          </Link>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.project,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Execution environment'),
        cell: (job: UnifiedJob) => (
          <Link
            to={RouteObj.ExecutionEnvironmentDetails.replace(
              ':id',
              job.summary_fields.execution_environment?.id?.toString() || ''
            )}
          >
            {job.summary_fields.execution_environment?.name}
          </Link>
        ),
        value: (job: UnifiedJob) =>
          job.type !== 'workflow_job' &&
          !isJobRunning(job.status) &&
          job.status !== 'canceled' &&
          !!job.summary_fields?.execution_environment,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Credentials'),
        cell: (job: UnifiedJob) => (
          <LabelGroup
            numLabels={5}
            collapsedText={t(`{{count}} more`, {
              count: (job.summary_fields.credentials?.length ?? 0) - 5,
            })}
          >
            {job.summary_fields.credentials?.map((cred) => (
              <CredentialLabel credential={cred} key={cred.id} />
            ))}
          </LabelGroup>
        ),
        value: (job: UnifiedJob) => !!job.summary_fields?.credentials?.length,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Labels'),
        cell: (job: UnifiedJob) => (
          <ChipGroup
            numChips={5}
            collapsedText={t(`{{count}} more`, {
              count: (job.summary_fields?.labels?.results.length ?? 0) - 5,
            })}
            ouiaId={`job-${job.id}-label-chips`}
          >
            {job.summary_fields?.labels?.results.map((l) => (
              <Chip key={l.id} isReadOnly ouiaId={`label-${l.id}-chip`}>
                {l.name}
              </Chip>
            ))}
          </ChipGroup>
        ),
        value: (job: UnifiedJob) => (job.summary_fields?.labels?.results.length ?? 0) > 0,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Explanation'),
        cell: (job: UnifiedJob) => job.job_explanation,
        value: (job: UnifiedJob) => job.job_explanation,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Job slice'),
        cell: (job: UnifiedJob) => (
          <span>{`${job.job_slice_number ?? 0}/${(job.job_slice_count ?? 0).toString()}`}</span>
        ),
        value: (job: UnifiedJob) => job.job_slice_count,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Job slice parent'),
        cell: (_job: UnifiedJob) => <span>{t`True`}</span>,
        value: (job: UnifiedJob) => job.type === 'workflow_job' && job.is_sliced_job,
        table: ColumnTableOption.Expanded,
        card: 'hidden',
        list: 'hidden',
        defaultSortDirection: 'desc',
        modal: ColumnModalOption.Hidden,
      },
    ],
    [inventorySourceChoices, options?.disableLinks, t]
  );
  return tableColumns;
}

const inventoryUrlPaths: { [key: string]: string } = {
  '': 'inventory',
  smart: 'smart_inventory',
  constructed: 'constructed_inventory',
};

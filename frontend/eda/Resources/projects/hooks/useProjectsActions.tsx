import { ButtonVariant } from '@patternfly/react-core';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IPageAction,
  PageActionSelection,
  PageActionType,
  usePageNavigate,
} from '../../../../../framework';
import { EdaRoute } from '../../../EdaRoutes';
import { EdaProject } from '../../../interfaces/EdaProject';
import { IEdaView } from '../../../useEventDrivenView';
import { useDeleteProjects } from './useDeleteProjects';

export function useProjectsActions(view: IEdaView<EdaProject>) {
  const { t } = useTranslation();
  const pageNavigate = usePageNavigate();
  const deleteProjects = useDeleteProjects(view.unselectItemsAndRefresh);
  return useMemo<IPageAction<EdaProject>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.None,
        variant: ButtonVariant.primary,
        isPinned: true,
        icon: PlusIcon,
        label: t('Create project'),
        onClick: () => pageNavigate(EdaRoute.CreateProject),
      },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: TrashIcon,
        label: t('Delete selected projects'),
        onClick: (projects: EdaProject[]) => deleteProjects(projects),
        isDanger: true,
      },
    ],
    [deleteProjects, pageNavigate, t]
  );
}

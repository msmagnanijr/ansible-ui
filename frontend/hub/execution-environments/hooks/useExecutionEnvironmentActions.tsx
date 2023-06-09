import { EditIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IPageAction, PageActionSelection, PageActionType } from '../../../../framework';
import { ExecutionEnvironment } from '../ExecutionEnvironment';

export function useExecutionEnvironmentActions() {
  const { t } = useTranslation();
  return useMemo<IPageAction<ExecutionEnvironment>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: EditIcon,
        label: t('Edit'),
        onClick: () => {
          /**/
        },
      },
    ],
    [t]
  );
}
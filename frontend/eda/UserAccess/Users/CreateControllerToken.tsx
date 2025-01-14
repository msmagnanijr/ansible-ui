import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  PageFormSubmitHandler,
  PageFormTextInput,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  usePageNavigate,
} from '../../../../framework';
import { RouteObj } from '../../../common/Routes';
import { usePostRequest } from '../../../common/crud/usePostRequest';
import { useEdaActiveUser } from '../../../common/useActiveUser';
import { EdaRoute } from '../../EdaRoutes';
import { EdaControllerToken, EdaControllerTokenCreate } from '../../interfaces/EdaControllerToken';
import { edaAPI } from '../../api/eda-utils';
import { EdaPageForm } from '../../EdaPageForm';

function ControllerTokenInputs() {
  const { t } = useTranslation();
  return (
    <>
      <PageFormTextInput<EdaControllerTokenCreate>
        name="name"
        label={t('Name')}
        placeholder={t('Enter name')}
        isRequired
        maxLength={150}
      />
      <PageFormTextInput<EdaControllerTokenCreate>
        name="description"
        label={t('Description')}
        placeholder={t('Enter description ')}
        maxLength={150}
      />
      <PageFormTextInput<EdaControllerTokenCreate>
        name="token"
        label={t('Token')}
        isRequired
        maxLength={150}
        placeholder={t('Enter controller token')}
      />
    </>
  );
}

export function CreateControllerToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageNavigate = usePageNavigate();
  const postRequest = usePostRequest<EdaControllerTokenCreate, EdaControllerToken>();
  const user = useEdaActiveUser();

  const onSubmit: PageFormSubmitHandler<EdaControllerTokenCreate> = async (token) => {
    await postRequest(edaAPI`/users/me/awx-tokens/`, token);
    pageNavigate(EdaRoute.MyTokens);
  };
  const onCancel = () => navigate(-1);

  const getPageUrl = useGetPageUrl();

  const canViewUsers = user?.roles.some((role) => role.name === 'Admin' || role.name === 'Auditor');
  const breadcrumbs = [
    ...(canViewUsers ? [{ label: t('Users'), to: getPageUrl(EdaRoute.Users) }] : []),
    {
      label: user?.username ?? '',
      to: canViewUsers
        ? getPageUrl(EdaRoute.UserPage, { params: { id: user?.id } })
        : getPageUrl(EdaRoute.MyPage),
    },
    {
      label: t('Controller tokens'),
      to: canViewUsers
        ? RouteObj.EdaUserDetailsTokens.replace(':id', `${user?.id || ''}`)
        : getPageUrl(EdaRoute.MyTokens),
    },
    { label: user?.username ?? '' },
  ];

  return (
    <PageLayout>
      <PageHeader title={t('Create Controller Token')} breadcrumbs={breadcrumbs} />
      <EdaPageForm
        submitText={t('Create controller token')}
        onSubmit={onSubmit}
        cancelText={t('Cancel')}
        onCancel={onCancel}
      >
        <ControllerTokenInputs />
      </EdaPageForm>
    </PageLayout>
  );
}

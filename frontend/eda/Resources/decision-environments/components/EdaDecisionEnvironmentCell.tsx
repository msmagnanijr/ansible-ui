import { TextCell, useGetPageUrl } from '../../../../../framework';
import { useGet } from '../../../../common/crud/useGet';
import { EdaRoute } from '../../../EdaRoutes';
import { EdaProject } from '../../../interfaces/EdaProject';

export function EdaDecisionEnvironmentCell(props: { id?: number }) {
  const getPageUrl = useGetPageUrl();
  const { data } = useGet<EdaProject>(
    props.id ? `/api/eda/v1/decision-environments/${props.id}/` : undefined,
    { dedupingInterval: 10 * 1000 }
  );
  if (!data) {
    switch (typeof props.id) {
      case 'number':
      case 'string':
        return <>{props.id}</>;
    }
    return <></>;
  }
  return (
    <TextCell
      text={data.name}
      to={
        props.id
          ? getPageUrl(EdaRoute.DecisionEnvironmentPage, { params: { id: props.id } })
          : undefined
      }
    />
  );
}

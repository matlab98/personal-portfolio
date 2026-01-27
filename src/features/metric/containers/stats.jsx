import { useQueryTwoQuery, useQueryFourQuery, useQueryOneQuery, useQueryThreeQuery } from "../services/statistics";
import StackChart from '@/components/stackChart/StackChart';
import { useTranslation } from 'react-i18next';
import MetricDashBoard from '@/containers/MetricDashboard';

function stats() {
  const { t } = useTranslation();
  const { data, error, isLoading } = useQueryTwoQuery();

  const { data: dataFour, error: errorFour, isLoading: isLoadingFour } = useQueryFourQuery();

  if (isLoading || isLoadingFour) return <div>{t('common.loading')}</div>;
  if (error || errorFour) return <div>{t('common.error', { message: error.message ?? errorFour.message })}</div>;
  
  
  return (
    <ul>
      <StackChart data={data.data} />   
      <MetricDashBoard data={dataFour.data} />
    </ul>
  );
}

export default stats;

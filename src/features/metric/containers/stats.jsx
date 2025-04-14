import { useQueryTwoQuery } from "../services/statistics";
import StackChart from '@/components/stackChart/StackChart';

function AskAi() {
  const { data, error, isLoading } = useQueryTwoQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data)
  
  return (
    <ul>
      <StackChart data={data.data} />   
    </ul>
  );
}

export default AskAi;

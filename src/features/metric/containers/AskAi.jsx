import { useQueryOneQuery } from "../services/statistics";


function AskAi() {
  const { data, error, isLoading } = useQueryOneQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data)
  
  return (
    <ul>{
      console.log(data)}      
    </ul>
  );
}

export default AskAi;

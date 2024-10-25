import { useParams } from "react-router-dom";
import PluginDetailTable from "../../components/PluginDetailTable";

const PluginDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <PluginDetailTable />
    </div>
  );
};

export default PluginDetails;

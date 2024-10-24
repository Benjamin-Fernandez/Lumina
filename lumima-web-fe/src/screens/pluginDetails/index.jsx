import { useParams } from "react-router-dom";
import PluginDetail from "../../components/PluginDetail";

const PluginDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <PluginDetail />
    </div>
  );
};

export default PluginDetails;

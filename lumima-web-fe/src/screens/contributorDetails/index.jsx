import ContributorDetailTable from "../../components/ContributorDetailTable";
import { useParams } from "react-router-dom";

const ContributorDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <ContributorDetailTable />
    </div>
  );
};

export default ContributorDetails;

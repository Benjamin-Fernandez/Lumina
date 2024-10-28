import ContributorDetailTable from "../../components/contributor/contributorDetail/ContributorDetailTable";
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

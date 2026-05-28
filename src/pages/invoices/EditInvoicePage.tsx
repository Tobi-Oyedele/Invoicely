import { useParams } from "react-router-dom";
import ViewInvoicePage from "./ViewInvoicePage";

const EditInvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  return <ViewInvoicePage defaultEditing={true} idOverride={id} />;
};

export default EditInvoicePage;

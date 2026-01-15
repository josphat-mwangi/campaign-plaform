import { ErrorPage } from "ochom-react-components";

const PageNotFound = () => {
  return <ErrorPage error={new Error("Page not found")} title="Oops!" />;
};

export default PageNotFound;

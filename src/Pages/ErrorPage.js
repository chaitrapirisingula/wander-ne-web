import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/Firebase";

function ErrorPage() {
  useEffect(() => {
    logEvent(analytics, "404_visit");
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Not Found</title>
      </Helmet>
      <div className="min-h-screen bg-yellow-100 p-5">
        <h4 className="text-2xl text-center font-semibold text-red-600">
          404: Page Not Found.
        </h4>
      </div>
    </div>
  );
}

export default ErrorPage;

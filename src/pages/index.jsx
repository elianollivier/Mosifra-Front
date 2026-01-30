import { useEffect, useState } from "preact/hooks";
import { getUserTypeFromCookie } from "../utils";
import CompanyHome from "./Company/CompanyHome.jsx";
import StudentHome from "./Student/StudentHome.jsx";
import UniversityHome from "./University/UniversityHome.jsx";
import Home from "./defaultindex.jsx";


export function HomeRouter() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const type = await getUserTypeFromCookie();
        setUserType(type);
      } catch (err) {
        console.warn('Failed to fetch user type:', err);
        setUserType(null);
      }
    };

    fetchUserType();
  }, []);

  if (userType === "company") return <CompanyHome />;
  if (userType === "student") return <StudentHome />;
  if (userType === "university") return <UniversityHome />;

  return <Home />;
}
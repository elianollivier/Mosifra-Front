import { BookOpen, Send } from "lucide-preact"
import { useLocation } from "preact-iso"
import { useEffect, useState } from "preact/hooks"
import { getCookie, getCourseTypes, getUserTypeFromCookie, getBaseUrl } from "../utils"

export default function Internships() {
  const location = useLocation()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null)
  const [loadingUserType, setLoadingUserType] = useState(true)
  
  

  useEffect(() => {

    const fetchUserType = async () => {
      const type = await getUserTypeFromCookie()
      setUserType(type)
      setLoadingUserType(false)
    }
    fetchUserType()

    const fetchInternships = async () => {
      const jwt = getCookie("jwt");
      const course_types = await getCourseTypes();
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      };

      const options = {
        method: "POST",
        headers,
        body: JSON.stringify({
          course_types
        })
      };

      try {
        const response = await fetch(`${getBaseUrl()}/courses/internships`, options);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        if (data.success) {
          setInternships(data.internships)
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    }

    fetchInternships();
  }, [])

  const handleApplyClick = () => {
    if (userType !== "student") {
      alert("Seuls les étudiants peuvent postuler à des stages.")
      return
    }
    // Application flow not implemented in this demo
  }

  

  if (loading) {
    return (
      <main className="min-h-screen bg-beige-mosifra flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-vert-mosifra font-semibold">Chargement des offres...</p>
        </div>
      </main>
    )
  }

  return (

    <main className="min-h-screen bg-beige-mosifra">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-vert-mosifra mb-2">
            Offres de stage
          </h1>
          <p className="text-xl text-gray-700">
            {userType === "student"
              ? "Consulter et postuler aux offres disponibles"
              : "Offres disponibles"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-vert-mosifra mb-2">
                  {internship.title}
                </h3>

                <p className="text-sm text-gray-600 italic mb-3">
                  Type de cours : {internship.course_type}
                </p>

                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-semibold text-vert-mosifra">📍 Lieu :</span>{" "}
                    {internship.place}
                  </p>

                  <p>
                    <span className="font-semibold text-vert-mosifra">
                      📅 Date de début :
                    </span>{" "}
                    {internship.date_start}
                  </p>

                  <p>
                    <span className="font-semibold text-vert-mosifra">
                      📅 Date de fin :
                    </span>{" "}
                    {internship.date_end}
                  </p>

                  <p>
                    <span className="font-semibold text-vert-mosifra">
                      ⏳ Longueur permise :
                    </span>{" "}
                    {internship.min_internship_length} à{" "}
                    {internship.max_internship_length} semaines
                  </p>
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  {internship.description}
                </p>

                {loadingUserType ? (
                  <div className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-lg text-center font-semibold cursor-not-allowed">
                    Consultation seulement
                  </div>
                ) : userType === "student" ? (
                  <button
                    onClick={handleApplyClick}
                    className="w-full px-4 py-3 bg-vert-mosifra text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Postuler
                  </button>
                ) : userType === "university" ? (
                  <div className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold text-center cursor-not-allowed">
                    Consultation seulement
                  </div>
                ) : (
                  <button
                    onClick={() => location.route("/login")}
                    className="w-full px-4 py-3 bg-vert-mosifra text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {internships.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Aucune offre disponible</p>
          </div>
        )}
      </div>
    </main>
  )
}

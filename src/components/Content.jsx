import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Flag from "./Flag";
import LoadingState from "./LoadingState";
import NotFound from "./NotFound";

export default function Content() {
  const [value, setValue] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);

  const [region, setRegion] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetch(`https://restcountries.com/v2/all`)
          .then((res) => res.json())
          .then((data) => {
            setFetchedData(data)
            setCountriesData(data);
            setIsLoading(false);
          });
      } catch (error) {
        console.log("Error fetching Data", error);
      }
    };
    fetchData();
  }, []);

  // const handleSelectChange = (e) => {
  //   const selectedValue = e.target.value;

  //   if (selectedValue === "all") {
  //     setRegion(selectedValue);
  //   } else {
  //     setRegion(`region/${selectedValue}`);
  //   }
  // };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
  
    if (selectedValue === "all") {
      setCountriesData(fetchedData);
    } else {
      const filteredData = fetchedData.filter((obj) =>
        obj.region.toLowerCase() === selectedValue.toLowerCase()
      );
      setCountriesData(filteredData);
    }
  };
  

  const filterCountries = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const filteredData = countriesData.filter((obj) =>
      obj.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (inputValue != "") {
      setCountriesData(filteredData);
    }
  };

  return (
    <div className="p-5 lg:px-12 py-8 bg-light-gray dark:bg-dark-gray duration-300 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between">
        <input
          type="text"
          onChange={filterCountries}
          value={value}
          placeholder="Search for a Country..."
          className="px-4 py-3 mb-4 lg:mb-0 w-full lg:w-96 bg-white dark:bg-dark-blue dark:text-white rounded-md focus:outline-none"
        />

        <select
          name="filter"
          onChange={handleSelectChange}
          className="px-4 py-3 w-56 bg-white dark:bg-dark-blue dark:text-white rounded-md appearance-none focus:outline-none"
        >
          <option value="" disabled selected hidden>
            Filter By Region
          </option>
          <option value="all" className="px-2 border border-b">
            All
          </option>
          <option value="africa" className="px-2 border border-b">
            Africa
          </option>
          <option value="americas" className="px-2 border border-b">
            America
          </option>
          <option value="asia" className="px-2 border border-b">
            Asia
          </option>
          <option value="europe" className="px-2 border border-b">
            Europe
          </option>
          <option value="oceania" className="px-2 border border-b">
            Oceania
          </option>
        </select>
      </div>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {countriesData.length > 0 ? (
            <div className="py-8 lg:py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12 justify-between">
              {countriesData.map((country, index) => (
                <div key={index} className="rounded-xl shadow-md">
                  <Link to={`/name/${country.name}`}>
                    <Flag details={country} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <NotFound />
            </div>
          )}
        </>
      )}
    </div>
  );
}

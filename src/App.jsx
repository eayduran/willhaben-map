import { useState, useEffect } from "react";
import Map from "./components/Map";
import LoadingSVG from "./assets/loading.svg";

const fetchData = async (currentUrl) => {
  const baseURL =
    "https://www.willhaben.at/webapi/iad/search/atz/seo/immobilien/mietwohnungen/";

  let URL = baseURL;

  if (currentUrl.includes("/mietwohnungen/")) {
    const extraURI = currentUrl.split("/mietwohnungen/");
    URL = baseURL + extraURI[1];
  } else {
    return null;
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "x-wh-client": "api@willhaben.at;responsive_web;server;1.0.0;desktop",
    accept: "application/json",
  });

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const rawData = await response.json();
    console.log(rawData);
    const editedData = rawData.advertSummaryList.advertSummary.map((item) => {
      let house = {
        coordinates: [0, 0],
        price: 0,
        size: 0,
        room: 0,
        link: "https://www.willhaben.at/",
      };
      item.attributes.attribute.forEach((word) => {
        switch (word.name) {
          case "COORDINATES":
            house.coordinates = word.values[0].split(",").map(parseFloat);
            break;
          case "NUMBER_OF_ROOMS":
            house.room = word.values[0];
            break;
          case "PRICE":
            house.price = word.values[0];
            break;
          case "ESTATE_SIZE/LIVING_AREA":
            house.size = word.values[0];
            break;
          default:
            break;
        }
      });

      item.contextLinkList.contextLink.forEach((word) => {
        if (word.id === "iadShareLink") {
          house.link = word.uri;
        }
      });
      return {
        description: item.description,
        price: house.price,
        room: house.room,
        coordinates: house.coordinates,
        size: house.size,
        img: item.advertImageList.advertImage[0].referenceImageUrl,
        url: house.link,
      };
    });

    return editedData;
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    return [];
  }
};
function App() {
  const [houses, setHouses] = useState(null);
  useEffect(() => {
    /* eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      const data = await fetchData(currentUrl);
      setHouses(data);
    });
  }, []);
  return (
    <div className="bg-[rgb(40,40,40)] w-[800px] h-[600px] flex flex-col justify-center items-center">
      {houses === null ? (
        <img
          className="animate-spin"
          src={LoadingSVG}
          width={40}
          alt="loading"
        />
      ) : (
        <Map data={houses} />
      )}
    </div>
  );
}

export default App;

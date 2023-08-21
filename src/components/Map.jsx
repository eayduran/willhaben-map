import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
const Map = ({ data }) => {
  const goToLink = (url) => {
    const newTab = window.open(url, "_blank");
    newTab.blur();
  };
  return (
    <MapContainer
      center={data[0].coordinates}
      zoom={14}
      style={{ height: 600, width: 800 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((item, index) => {
        if (item.coordinates !== undefined) {
          return (
            <Circle center={item?.coordinates} radius={100} key={index}>
              <Popup>
                <div
                  className="flex justify-center items-center w-[300px] h-[200px]"
                  onClick={goToLink.bind(this, item.url)}
                >
                  <div className="w-full">
                    <img src={item.img} className="h-[150px]" alt="house" />
                  </div>
                  <div className="w-full h-full flex flex-col p-2 gap-6 justify-center items-start">
                    <div className="line-clamp-3 text-sm font-semibold">
                      {item.description}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold mr-2 text-base">
                        {item.size}
                      </span>
                      m2 <span className="mx-2">|</span>
                      <span className="font-bold mr-2 text-base">
                        {item.room}
                      </span>
                      Room
                    </div>
                    <div className="text-lg font-bold">€ {item?.price}</div>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        }
      })}
    </MapContainer>
  );
};

Map.propTypes = {
  data: PropTypes.data,
};

export default Map;

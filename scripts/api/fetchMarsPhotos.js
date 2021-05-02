// use NASA Mars Rover Photos
// https://api.nasa.gov/index.html#apply-for-an-api-key
export function fetchMarsPhoto(earthDate, rover, camera, page = 1) {
  return fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?` +
      `api_key=${nasaKeyApi}` +
      `&earth_date=${earthDate.toISOString().split("T")[0]}` +
      `&camera=${camera}` +
      `${page !== 1 ? `$page=${page}` : ""}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
}

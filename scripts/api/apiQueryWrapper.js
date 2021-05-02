const incrementQueryDateByOneDay = (queryDate) => {
  queryDate.setDate(queryDate.getDate() + 1);
};
const oneDayInMillesconds = 1000 * 3600 * 24;
const diffrenceBetweenDatesInDays = (date1, date2) => {
  let difreence = Math.abs(date2.getTime() - date1.getTime());
  difreence /= 2700000;
  difreence = difreence >>> 5;
  return difreence;
};

// takes query data and generate every possbily values betweens range date
// next, reqest for all data ( even if they are partitioned )
// and pass to data handler
export function apiQueryWrapper(
  newDataHandler,
  fetchData,
  numberOfElementsAtOnePage = 0
) {
  const isNextPage = (data) =>
    data.length !== 0 && data.length % numberOfElementsAtOnePage === 0;

  // if api returns result in partition, get all of them for this query
  const getNextPage = async (queryDate, rover, camera, pageCount = 1) => {
    fetchData(queryDate, rover, camera).then((res) => {
      newDataHandler(res.photos);
      if (isNextPage(res)) {
        getNextPage(queryDate, rover, camera, ++pageCount);
      }
    });
  };

  return async function (dateFrom, dateTo, rovers, cameras) {
    if (
      !(
        dateFrom instanceof Date &&
        dateTo instanceof Date &&
        rovers instanceof Array &&
        cameras instanceof Array
      )
    ) {
      throw "invalid arguments data type";
    }
    const queryDate = new Date(dateFrom.getTime());

    // query for first day, lower range date
    for (const rover of rovers) {
      for (const camera of cameras) {
        getNextPage(queryDate, rover, camera).catch((err) =>
          console.error(err)
        );
      }
    }

    // query for all days between lower and upper range (if exist),
    // including upper range date
    while (diffrenceBetweenDatesInDays(queryDate, dateTo) !== 0) {
      incrementQueryDateByOneDay(queryDate);

      for (const rover of rovers) {
        for (const camera of cameras) {
          getNextPage(queryDate, rover, camera).catch((err) =>
            console.error(err)
          );
        }
      }
    }
  };
}

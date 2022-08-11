import React, { useState, useEffect } from "react";

const calculateRange = (data, rowsPerPage) => {
  const range = [];
  const num = Math.ceil(data.length / rowsPerPage);
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return range;
};

const sliceData = (data, page, rowsPerPage) => {
  return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

const Table = ({ data, activeTab, rowsPerPage }) => {
  
  data = data.filter((row) => row.significant_type === activeTab);

  const [page, setPage] = useState(1);
  const tableRange = calculateRange(data, rowsPerPage);
  const slice = sliceData(data, page, rowsPerPage);
  
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <>
    { tableRange.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="table table-zebra w-12">
          <thead>
            <tr>
              <th>Engagement Type</th>
              <th>Variable Name</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr key={row.id}>
                <td>{row.engagement_type}</td>
                <td>{row.variable}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tableFooter">
          <button
            className={`tableButton ${
              page === 1 ? "tableInactiveButton" : "tableActiveButton"
            }`}
            onClick={() => setPage(page-1)}
            disabled={page === 1 ? true : false}
          >
            Prev
          </button>
          <button
            className={`tableButton ${
              page === tableRange.length ? "tableInactiveButton" : "tableActiveButton"
            }`}
            onClick={() => setPage(page+1)}
            disabled={page === tableRange.length ? true : false}
          >
            Next
          </button>
        </div>
      </div>
    ) : (
      <div className="stat-title my-3">
        No data available.
      </div>  
    ) }
    </>
  );
}

export default Table;

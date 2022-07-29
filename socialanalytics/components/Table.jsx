import React from "react";

const Table = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-12">
        <thead>
          <tr>
            <th>Engagement Type</th>
            <th>Variable Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Total Engagement</th>
            <td>media_type_carousel</td>
          </tr>
          <tr>
            <th>Favorites</th>
            <td>media_type_carousel</td>
          </tr>
          <tr>
            <th>Comments</th>
            <td>media_type_video</td>
          </tr>
          <tr>
            <th>Shares</th>
            <td>media_type_image</td>
          </tr>
          <tr>
            <th>Likes</th>
            <td>media_type_image</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;

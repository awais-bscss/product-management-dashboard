export default function ProductTableSkeleton() {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {['', 'Product', 'ID', 'Price', 'Stock', 'Status', ''].map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              <td><div className="skeleton" style={{ height: 16, width: 16 }} /></td>
              <td><div className="skeleton" style={{ height: 16, width: 200 }} /></td>
              <td><div className="skeleton" style={{ height: 16, width: 80 }} /></td>
              <td><div className="skeleton" style={{ height: 16, width: 60 }} /></td>
              <td><div className="skeleton" style={{ height: 16, width: 50 }} /></td>
              <td><div className="skeleton" style={{ height: 22, width: 80, borderRadius: 99 }} /></td>
              <td><div className="skeleton" style={{ height: 28, width: 28 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

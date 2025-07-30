import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<{ [key: number]: Artwork }>({});
  const rowsPerPage = 10;

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}`);
    const json = await res.json();
    setArtworks(json.data);
    setTotalRecords(json.pagination.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const onPageChange = (e: any) => {
    setPage(e.page);
  };

  const onRowSelectChange = (e: any) => {
    // e.value is the new array of selected rows
    const updated: { [key: number]: Artwork } = {};
    (Array.isArray(e.value) ? e.value : [e.value]).forEach((row: Artwork) => {
      updated[row.id] = row;
    });
    setSelectedRows(updated);
  };

  return (
    <div className="p-4">
      <h2>Artworks</h2>
      <div className="p-3 border-1 border-round surface-border mb-3">
        <h4>Selected Artworks ({Object.keys(selectedRows).length})</h4>
        <ul>
          {Object.values(selectedRows).map(row => (
            <li key={row.id}>{row.title}</li>
          ))}
        </ul>
      </div>

      <DataTable
        value={artworks}
        paginator
        lazy
        first={page * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPage={onPageChange}
        dataKey="id"
        loading={loading}
        selection={Object.values(selectedRows)}
        onSelectionChange={onRowSelectChange}
        selectionMode="checkbox"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
};

export default App;

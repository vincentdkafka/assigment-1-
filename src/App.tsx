import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import 'primeicons/primeicons.css';

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
  const [selectCount, setSelectCount] = useState('');
  const overlayRef = React.useRef<any>(null);

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
    
    const updated: { [key: number]: Artwork } = {};
    (Array.isArray(e.value) ? e.value : [e.value]).forEach((row: Artwork) => {
      updated[row.id] = row;
    });
    setSelectedRows(updated);
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    overlayRef.current?.toggle(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectCount(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleSelectSubmit = () => {
    const count = Math.min(Number(selectCount), artworks.length);
    const selected: { [key: number]: Artwork } = {};
    for (let i = 0; i < count; i++) {
      const row = artworks[i];
      if (row) selected[row.id] = row;
    }
    setSelectedRows(selected);
    overlayRef.current?.hide();
  };

  return (
    <div className="p-4">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        Artworks
        <button
          type="button"
          className="p-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onClick={handleChevronClick}
        >
          <span className="pi pi-chevron-down" style={{ fontSize: '1.5rem' }}></span>
        </button>
        <OverlayPanel ref={overlayRef} dismissable showCloseIcon>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 200 }}>
            <input
              type="text"
              value={selectCount}
              onChange={handleInputChange}
              placeholder="Enter number of rows"
              style={{ padding: '0.5rem', fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={handleSelectSubmit}
              style={{ padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </OverlayPanel>
      </h2>
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

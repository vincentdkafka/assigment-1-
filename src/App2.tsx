import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import 'primeicons/primeicons.css';

import { fetchArtworks } from './api';
import type { Artwork } from './types';




const App: React.FC = () => {
  const [artList, setArtList] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0)

  const [checkedItems, setCheckedItems] = useState<{ [id: number]: Artwork }>({});

  const rowsPerPage = 10;
  const [inputCount, setInputCount] = useState('')

  const panelRef = React.useRef<any>(null);

  const loadArtworks = async (pageNum: number) => {
    setIsLoading(true);

    try {
      const response = await fetchArtworks(pageNum)
        setArtList(response.data)
        setTotalItems(response.pagination.total)
    } catch (err) {
        setArtList([])
        setTotalItems(0)
    }



    setIsLoading(false)
  };







  useEffect(() => {
    loadArtworks(currentPage)
  },    [currentPage]);

  const handlePageChange = (e: any) => {
    setCurrentPage(e.page)
  };





 
      const handleRowSelection = (e: any) => {
        const updatedSelection: { [id: number]: Artwork } = {};

        (Array.isArray(e.value) ? e.value : [e.value]).forEach((item: Artwork) => {
          updatedSelection[item.id] = item;
        });

    setCheckedItems(updatedSelection);
  };

       const togglePanel = (e: React.MouseEvent) => {
         panelRef.current?.toggle(e);


       }



  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputCount(value);
  }

      const handleSelectByCount = () => {
        const howMany = Math.min(Number(inputCount), artList.length);
        const selected: { [id: number]: Artwork } = {};

        for (let i = 0; i < howMany; i++) {
          const art = artList[i];
          if (art) selected[art.id] = art;
    }

    setCheckedItems(selected);
    panelRef.current?.hide();
  }

        return (
          <div className="p-4">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

              Harsh Artworks

              <button
                type="button"
                className="p-link"
                onClick={togglePanel}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span className="pi pi-chevron-down" style={{ fontSize: '1.5rem' }}></span>
              </button>

              <OverlayPanel ref={panelRef} dismissable showCloseIcon>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 200 }}>
                    <input
                      type="text"
                      value={inputCount}
                      onChange={onInputChange}
                      placeholder="Enter number of rows"
                      style={{ padding: '0.5rem', fontSize: '1rem' }}
                    />

                  <button
                    type="button"
                    onClick={handleSelectByCount}
                    style={{ padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}
                  >
                    Submit
                      </button>
                      </div>
                   </OverlayPanel>
                </h2>

            <DataTable  value={artList} 
            paginator 
            lazy first={currentPage * rowsPerPage}   
            rows={rowsPerPage}  
            totalRecords={totalItems}  onPage={handlePageChange}  dataKey="id"  
            loading={isLoading}  selection={Object.values(checkedItems)}  
            onSelectionChange={handleRowSelection} 
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

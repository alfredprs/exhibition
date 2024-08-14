import { useState, useRef, useEffect } from 'react';


const PaginatedTable = ({dataAll, location}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const paginationRef = useRef(null);
    const [prevLocation, setPrevLocation] = useState(null);

    useEffect(() => {
        if (paginationRef.current) {
            paginationRef.current.focus();
        }
    }, [currentPage, itemsPerPage]);

    if (location === null) {
        setPrevLocation(location);
    } else if (location !== prevLocation) {
        setPrevLocation(location);
        setCurrentPage(1);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataAll.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(dataAll.length / itemsPerPage);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = e => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handlePageNavigation = increment => {
        const nextPage = currentPage + increment;
        if (nextPage >= 1 && nextPage <= totalPages) {
          setCurrentPage(nextPage);
        }
    };

    return (
        <div className="mx-4 my-8">
            <div className="p-4 rounded-3xl shadow-2xl border-gray-300">
                {/* <h2 className="font-bold text-2xl mb-4">Data Merinci</h2> */}
                <div className="border rounded-3xl shadow -2xl overflow-y-hidden">
                    <table className=" w-full">
                        <thead>
                            <tr className="rounded-lg bg-gray-200 shadow-md">
                                <th className="px-2 py-1 sm:px-4 sm:py-2 text-center ">pH Air</th>
                                <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Suhu Air(<sup>o</sup>C)</th>
                                <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Suhu Ruangan(<sup>o</sup>C)</th>
                                {/* <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Weight</th> */}
                                <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Gas Dihasilkan(m<sup>3</sup>)</th>
                                {/* <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Gas Terpakai(m<sup>3</sup>)</th> */}
                                {/* <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Sisa Penyimpanan(m<sup>3</sup>)</th> */}
                                <th className="px-2 py-1 sm:px-4 sm:py-2 text-center">Tanggal Diperbaharui</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className={`rounded-3xl ${index % 2 === 0 ? 'bg-orange-100' : 'bg-blue-100'} shadow-2xl`}>
                                    <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center ">{item.ph}</td>
                                    <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{item.temp_liquid}</td>
                                    <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{item.temp_ambien}</td>
                                    {/* <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{item.weight}</td> */}
                                    <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{Math.abs(item.gas_prod)}</td>
                                    {/* <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{Math.abs(item.gas_used)}</td> */}
                                    {/* <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">{item.storage}</td> */}
                                    <td className="border px-2 py-1 sm:px-4 sm:py-2 text-center">
                                        {new Date(item.date_created).toISOString().replace('T', ' ').split('.')[0]}  
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination totalPages={totalPages} paginate={paginate}
                            currentPage={currentPage} paginationRef={paginationRef}
                            handlePageNavigation={handlePageNavigation} />
                <div className="mt-4 flex justify-center">
                    <span className="mr-2">Data per Halaman:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="block bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

const Pagination = ({ totalPages, paginate, currentPage, paginationRef, handlePageNavigation }) => {
    const [jumpPage, setJumpPage] = useState('');

    const pageNumbers = [];

    const maxPageNumbers = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));

    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage < maxPageNumbers - 1) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    const handleJumpPage = () => {
        const pageNumber = parseInt(jumpPage);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
            setJumpPage('');
        } else if (pageNumber > totalPages) {
            paginate(totalPages);
            setJumpPage('');
        }
    };
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
  
    return (
        <nav className="mt-4 flex flex-col items-center justify-center">
            <div className="pagination-container flex">
                <button
                    onClick={() => handlePageNavigation(-1)}
                    disabled={currentPage === 1}
                    className="ml-4 px-3 py-1 border border-gray-400 rounded-full focus:outline-none"
                    ref={paginationRef}
                >
                    {'<'}
                </button>
                <div className='py-1'>
                    <ul ref={paginationRef} className="pagination flex">
                        {pageNumbers.map(number => (
                        <li key={number} className={currentPage === number ? 'active' : null}>
                            <a
                            onClick={() => paginate(number)}
                            className={`page-link px-3 py-1 focus:outline-none ${currentPage === number ? 'text-blue-600' : ''}`}
                            >
                            {number}
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => handlePageNavigation(1)}
                    disabled={currentPage === totalPages}
                    className="mr-4 px-3 py-1 border border-gray-400 rounded-full focus:outline-none"
                    ref={paginationRef}
                >
                    {'>'}
                </button>
            </div>
            <div className="flex items-center">
                <p>Lompat ke halaman: </p>
                <input
                    type="text"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    className="m-2 px-2 py-1 border border-gray-400 rounded focus:outline-none"
                    style={{ maxWidth: '3rem' }}
                />
                <button
                    onClick={handleJumpPage}
                    className="px-3 py-1 border border-gray-400 rounded-full focus:outline-none"
                >
                    Go
                </button>
            </div>
        </nav>
        
    );
}

export default PaginatedTable;

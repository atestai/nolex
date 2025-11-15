import { useState } from "react";

export const SearchBy = {
    NAME: 'name',
    MIN_COD: 'min_cod',
    INTERNAL_CODE: 'internal_code'
} as const;

export type SearchByType = typeof SearchBy[keyof typeof SearchBy];

export function SearchBar() {

    const [query, setQuery] = useState('');
    const [searchBy, setSearchBy] = useState<SearchByType>(SearchBy.NAME);

    const placeholder = "Search...";

    const onSearch = (query: string, searchBy: SearchByType) => {
        console.log(`Searching for "${query}" by "${searchBy}"`);
        // Implement the actual search logic here
    }

    return (
        <div>
            <div className="flex flex-row space-x-4"  >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-[60%] p-2 border border-gray-300 rounded"
                />

                <select className="w-[30%] p-2 border border-gray-300 rounded" 
                    value={searchBy} 
                    onChange={(e) => setSearchBy(e.target.value as SearchByType)}>
                    <option value={SearchBy.NAME}>Name</option>
                    <option value={SearchBy.MIN_COD}>Min Cod</option>
                    <option value={SearchBy.INTERNAL_CODE}>Internal Code</option>
                </select>
             
                <button title="Search"
                    className={`w-[10%] p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 ${query.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={() => onSearch(query, searchBy)}
                    disabled={query.trim() === ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                <button title="Reset"
                    className={`w-[10%] p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 ${query.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={() => { setQuery(''); onSearch('', searchBy); }}
                    disabled={query.trim() === ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
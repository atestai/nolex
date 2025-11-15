import { useSharedState } from "../hooks/useSharedState";
import { getClinics, getClinicsBySearch } from "../utilities/fetch";

export const SearchBy = {
    NAME: 'name',
    MIN_COD: 'min_cod',
    INTERNAL_CODE: 'internal_code'
} as const;

export type SearchByType = typeof SearchBy[keyof typeof SearchBy];

export function SearchBar() {

    const { 
        query, setQuery, 
        searchBy, setSearchBy, 
        setClinics, 
        setSelectedClinic, 
        setBodyParts, 
        setSelectedBodyPart, 
        setBodyExames, 
        setSelectedExame 
    } = useSharedState();

    const placeholder = "Search...";

    const onSearch = async (query: string, searchBy: SearchByType) => {

        setClinics([]);
        setSelectedClinic(undefined);
        setBodyParts([]);
        setSelectedBodyPart(undefined);
        setBodyExames([]);
        setSelectedExame(undefined);

        if (query.trim() === '') {
            const data = await getClinics();
            return setClinics(data.clinics);
        }

        const data = await getClinicsBySearch(query, searchBy);
        return setClinics(data.clinics); 
    }

    return (
        <div>
            <div className="flex flex-row space-x-4"  >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch(query, searchBy);
                        }
                    }}
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
                    className={`w-[10%] p-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 transition duration-200 ${query.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={() => { setQuery(''); onSearch('', searchBy); }}
                    disabled={query.trim() === ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.938 8.067a8 8 0 10-1.605 7.596" />
                    </svg>

                </button>
            </div>
        </div>
    );
}
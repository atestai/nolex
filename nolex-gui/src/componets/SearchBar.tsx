import { useEffect, useState } from "react";
import { useSharedState } from "../hooks/useSharedState";
import { getFrontendConfig } from "../utilities/fetch";
import type { SearchStatus } from "../types/state.types";
import { Reset, Search } from "./Icons";

export const SearchBy = {
    NAME: 'name',
    MIN_COD: 'min_cod',
    INTERNAL_CODE: 'internal_code'
} as const;

export type SearchByType = typeof SearchBy[keyof typeof SearchBy];

export function SearchBar() {
    const placeholder = "Search...";
    const [searchDefault, setSearchDefault] = useState<SearchStatus>();
    const [search, setSearch] = useState<SearchStatus>();

    const disabledReset = searchDefault?.query === search?.query && searchDefault?.searchBy === search?.searchBy;
    const disabled = false;

    const {      
        setSearchStatus, 
        setClinics, 
        setSelectedClinic, 
        setBodyParts, 
        setSelectedBodyPart, 
        setBodyExames, 
        setSelectedExame 
    } = useSharedState();

    const onSearch = async (queryText: string, searchBy: SearchByType) => {
        setClinics([]);
        setSelectedClinic(undefined);
        setBodyParts([]);
        setSelectedBodyPart(undefined);
        setBodyExames([]);
        setSelectedExame(undefined);
        setSearchStatus({ query: queryText, searchBy });
    }

    const onReset = async () => {
        setSearch({ query: searchDefault?.query || '', searchBy: searchDefault?.searchBy || SearchBy.NAME }); 
        onSearch(searchDefault?.query || '', searchDefault?.searchBy || SearchBy.NAME);
    }

    useEffect(() => {
        async function fetchConfig() {
            const data = await getFrontendConfig();
            if (data) {
                setSearchDefault({
                    query: data.query || '',
                    searchBy: data.searchBy || SearchBy.NAME
                });
                setSearch({
                    query: data.query || '',
                    searchBy: data.searchBy || SearchBy.NAME
                });

                onSearch(data.query || '', data.searchBy || SearchBy.NAME);
            }
        }
        fetchConfig();
    }, []);


    return (
        <div>
            <div className="flex flex-row space-x-4"  >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search?.query || ''}
                    onChange={(e) => setSearch( {
                        query: e.target.value, 
                        searchBy: (search?.searchBy as SearchByType) || SearchBy.NAME
                    }) }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch(search?.query || '', (search?.searchBy as SearchByType) || SearchBy.NAME);
                        }
                    }}
                    className="w-[60%] p-2 border border-gray-300 rounded"
                />

                <select className="w-[30%] p-2 border border-gray-300 rounded" 
                    value={search?.searchBy || SearchBy.NAME} 
                    onChange={(e) => setSearch({
                        query: (search?.query as string) || '',
                        searchBy: e.target.value as SearchByType
                    })}
                >
                    <option value={SearchBy.NAME}>Name</option>
                    <option value={SearchBy.MIN_COD}>Min Cod</option>
                    <option value={SearchBy.INTERNAL_CODE}>Internal Code</option>
                </select>
             
                <button title="Search"
                    className={`w-[10%] p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={() => onSearch(search?.query || '', (search?.searchBy as SearchByType) || SearchBy.NAME)}
                    disabled={disabled}>
                   <Search />
                </button>

                <button title="Reset"
                    className={`w-[10%] p-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 transition duration-200 ${disabledReset ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={onReset}
                    disabled={disabledReset}>
                    <Reset />
                </button>
            </div>
        </div>
    );
}
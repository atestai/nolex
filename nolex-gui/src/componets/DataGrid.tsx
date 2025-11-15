import { type ReactNode } from 'react';
import { useSharedState } from '../hooks/useSharedState';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';

export interface DataGridType {
    id: string;
    clinicName: string;
    bodyPartName: string;
    exameName: string;
    min_cod: string;
    internal_code: string;
}

interface Column<T> {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => ReactNode;
    width?: string;
}

interface DataGridProps {
     className?: string;
}


export function DataGrid( { className }: DataGridProps) {

    //const [data, setData] = useState<DataGridType[]>([]);   
    
    //     {
    //         id: '1',
    //         clinicName: 'Juan Pérez',
    //         bodyPartName: 'Cardiología',
    //         exameName: 'ECG',
    //         min_cod: 'juan.perez@example.com',
    //         internal_code: 'Administrador',
    //     },
    //     {
    //         id: '2',
    //         clinicName: 'Juan Pérez s',
    //         bodyPartName: 'Cardiología s',
    //         exameName: 'ECG s',
    //         min_cod: 'juan.perez@example.com s',
    //         internal_code: 'Administrador s',
    //     },
    //     {
    //         id: '3',
    //         clinicName: 'Juan Pérez s',
    //         bodyPartName: 'Cardiología s',
    //         exameName: 'ECG s',
    //         min_cod: 'juan.perez@example.com s',
    //         internal_code: 'Administrador s',
    //     },
    // ]);

    // const addItem = (item: DataGridType) => {
    //     setData(prevData => [...prevData, item]);
    // }   
    
    const { dataStore : data, setDataStore: setData } = useSharedState();

    const {
        isOpen,
        isLoading,
        options,
        openDialog,
        closeDialog,
        handleConfirm,
    } = useConfirmDialog();

    const deleteRow = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        openDialog({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete this row?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                setData(prevData => prevData.filter(row => row.id !== id));
            },
        });

      
        
    }   

    const moveUp = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setData(prevData => {
            const index = prevData.findIndex(row => row.id === id);
            if (index > 0) {
                const newData = [...prevData];      
                [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
                return newData;
            }
            return prevData;
        });
    }

    const moveDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setData(prevData => {
            const index = prevData.findIndex(row => row.id === id);     
            if (index < prevData.length - 1) {
                const newData = [...prevData];
                [newData[index + 1], newData[index]] = [newData[index], newData[index + 1]];
                return newData;
            }   
            return prevData;
        });
    }

    const columns : Column<DataGridType>[] =  [
        // {
        //     key: 'id' as keyof DataGridType,
        //     header: 'ID',
        //     render: (value: string) => (
        //         <span className="inline-block w-[100px] truncate" title={String(value)}>
        //             {String(value)}
        //         </span>
        //     ),
        // },
        {
            key: 'clinicName' as keyof DataGridType,
            header: 'Clinic name',
        },
        {
            key: 'bodyPartName' as keyof DataGridType,
            header: 'Body Part',
        },
        {
            key: 'exameName' as keyof DataGridType,
            header: 'Exame'
        },
        {
            key: 'min_cod' as keyof DataGridType,
            header: 'Ministerial code',
        },
        {
            key: 'internal_code' as keyof DataGridType,
            header: 'Internal code',
        },
        {
            key: 'id' as keyof DataGridType,
            header: 'Actions',
            render: (_value: string, row: DataGridType) => (
                <div className="text-right">
                    <button
                        title='Delete'
                        onClick={(e) => { deleteRow(e, row.id); }}
                        className="p-2 bg-red-600 hover:bg-red-900 rounded text-white transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 10-2 0v6a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    <button
                        title='Move up'
                        onClick={(e) => { moveUp(e, row.id); }}
                        className="p-2 ml-3 bg-blue-600 hover:bg-blue-900 rounded text-white transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        title='Move down'
                        onClick={(e) => { moveDown(e, row.id); }}
                        className="p-2 ml-1 bg-green-600 hover:bg-green-900 rounded text-white transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 011.414-1.414L9 14.586V3a1 1 0 112 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ),  
        },
    ];

    return (
        <>
            <div className={`overflow-x-auto ${className}`}>
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={String(column.key)}
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
                                        >
                                            <div className="flex items-center">
                                                {column.header}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No data available.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr
                                            key={String(row.id)}
                                        >
                                            {columns.map((column) => (
                                                <td key={String(column.key)}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                >
                                                    {column.render
                                                        ? column.render(row[column.key], row)
                                                        : String(row[column.key] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isOpen}
                onClose={closeDialog}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                type={options.type}
                confirmLoading={isLoading}
            />
      </>
    );
}

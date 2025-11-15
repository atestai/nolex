import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = undefined,
    type = 'info',
    confirmLoading = false,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen && !confirmLoading) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, confirmLoading]);


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && !confirmLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bgColor: 'bg-red-100',
            buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bgColor: 'bg-yellow-100',
            buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        },
        info: {
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-blue-100',
            buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
        success: {
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-green-100',
            buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        },
    };

    const currentStyle = typeStyles[type];

    const dialogContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
            onClick={handleBackdropClick}
        >
            <div
                ref={dialogRef}
                className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
            >
                <div className="p-6">
                    <div className="flex items-start">

                        <div className={`flex-0 flex items-center justify-center w-12 h-12 rounded-full ${currentStyle.bgColor}`}>
                            {currentStyle.icon}
                        </div>

                        <div className="ml-4 flex-1">
                            <h3
                                id="dialog-title"
                                className="text-lg font-semibold text-gray-900 mb-2"
                            >
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-lg">
                    {cancelText && <button
                        type="button"
                        onClick={onClose}
                        disabled={confirmLoading}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {cancelText}
                    </button>}
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={confirmLoading}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${currentStyle.buttonColor}`}
                    >
                        {confirmLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                In progress...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(dialogContent, document.body);
};

export default ConfirmDialog;
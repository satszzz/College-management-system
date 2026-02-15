import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="pagination-container">
            <span className="pagination-info">
                Showing {startItem}–{endItem} of {totalItems}
            </span>
            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FiChevronLeft size={16} />
                </button>
                {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                        <span key={`dots-${idx}`} className="page-dots">...</span>
                    ) : (
                        <button
                            key={page}
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
                )}
                <button
                    className="page-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;

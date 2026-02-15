// localStorage persistence service for CRUD operations

const STORAGE_PREFIX = 'cmis_';

export const storageService = {
    get(key, defaultValue) {
        try {
            const stored = localStorage.getItem(STORAGE_PREFIX + key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage save failed:', e);
        }
    },

    remove(key) {
        localStorage.removeItem(STORAGE_PREFIX + key);
    },

    clear() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(STORAGE_PREFIX))
            .forEach(k => localStorage.removeItem(k));
    }
};

// CSV export utility
export const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) return;

    const csvHeaders = headers || Object.keys(data[0]);
    const csvRows = data.map(row =>
        csvHeaders.map(header => {
            const value = row[header.key || header] ?? '';
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')
    );

    const headerRow = csvHeaders.map(h => h.label || h).join(',');
    const csvContent = [headerRow, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Print utility
export const printContent = (elementId) => {
    const content = document.getElementById(elementId);
    if (!content) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>CMIS Report</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 2rem; color: #1a1a2e; }
                h1 { color: #667eea; margin-bottom: 1rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e9ecef; }
                th { background: #f8f9fa; font-weight: 600; }
                .print-header { display: flex; justify-content: space-between; border-bottom: 2px solid #667eea; padding-bottom: 1rem; margin-bottom: 1rem; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div class="print-header">
                <div><h1>🎓 College Management System</h1></div>
                <div><p>Generated: ${new Date().toLocaleDateString()}</p></div>
            </div>
            ${content.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

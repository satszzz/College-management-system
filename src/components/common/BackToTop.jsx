import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                setVisible(mainContent.scrollTop > 300);
            } else {
                setVisible(window.scrollY > 300);
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            className={`back-to-top ${visible ? 'show' : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
        >
            <FiArrowUp size={20} />
        </button>
    );
};

export default BackToTop;

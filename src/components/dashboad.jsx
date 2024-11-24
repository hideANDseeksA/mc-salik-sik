import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import '../styles/App.css';
import logoLeft from '../MC_Grad_School_Logo2023.gif';
import logoRight from '../download-_1_.png';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [years, setYears] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [selectedLetter, setSelectedLetter] = useState('');

    const navigate = useNavigate();

    const handleClick = (url) => {
        if (url) {
            navigate('/view-pdf', { state: { pdfUrl: url } });
        } else {
            Swal.fire('No PDF Available', 'This thesis does not have an available PDF link.', 'info');
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            Swal.fire({
                title: 'Loading Thesis...',
                text: 'Please wait while we fetch the data.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch('https://gs-backend-r39y.onrender.com/api/research');
                if (!response.ok) {
                    throw new Error('Failed to fetch thesis');
                }
                const data = await response.json();
                setBooks(data);

                const uniqueYears = [...new Set(data.map(book => book.year.trim()))]
                    .filter(year => year)
                    .sort((a, b) => b - a);
                setYears(uniqueYears);
            } catch (err) {
                setError('Failed to fetch thesis. Please try again later.');
            } finally {
                setLoading(false);
                Swal.close();
            }
        };

        fetchBooks();

        const savedSearch = localStorage.getItem('thesisSearch');
        if (savedSearch) setSearch(savedSearch);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        localStorage.setItem('thesisSearch', value);
    };

    const handleYearChange = (e) => {
        const value = e.target.value;
        setSelectedYear(value);
        localStorage.setItem('selectedYear', value);
    };

    const handleLetterClick = (letter, event) => {
        if (event.detail === 1) {
            setSelectedLetter(letter);
        } else if (event.detail === 2) {
            setSelectedLetter('');
        }
    };

    const filterBooks = () => {
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                book.keyword.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesYear = selectedYear ? book.year === selectedYear : true;
            const matchesLetter = selectedLetter ? book.title.startsWith(selectedLetter) : true;
            return matchesSearch && matchesYear && matchesLetter;
        });
    };

    const filteredBooks = filterBooks();

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="dashboard">
            <Navbar />
            <div className="container mt-4">
                {/* Logo and Title Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center">
                    <img src={logoLeft} alt="Logo Left" className="logo mb-2 mb-md-0" />
                    <h2 className="text-center mb-2 mb-md-0">MC salik-sik</h2>
                    <img src={logoRight} alt="Logo Right" className="logo" />
                </div>

                {/* Search and Filter Section */}
                <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <div className="form-floating">
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="Search by title or keyword"
                                value={search}
                                onChange={handleSearchChange}
                                className="form-control border-dark"
                            />
                            <label htmlFor="searchInput">Search by title or keywords</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-floating">
                            <select
                                id="yearFilter"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="form-select"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="yearFilter">Filter by year</label>
                        </div>
                    </div>
                </div>

                {/* Alphabet Filter */}
                <div className="mb-4">
                    <div className="alphabet-filter text-center d-flex justify-content-center flex-wrap">
                        {alphabet.map(letter => (
                            <button
                                key={letter}
                                className={`btn btn-outline-dark rounded-circle mx-1 my-1 ${selectedLetter === letter ? 'btn-dark text-white' : ''}`}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    fontSize: '16px',
                                }}
                                onClick={(e) => handleLetterClick(letter, e)}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accordion or Results */}
                {loading ? (
                    <p className="text-center" aria-live="polite">
                        Loading thesis...
                    </p>
                ) : error ? (
                    <p className="text-center text-danger" aria-live="polite">
                        {error}
                    </p>
                ) : (
                    <div className="accordion" id="thesisAccordion">
                        {filteredBooks.length === 0 ? (
                            <p className="text-center">No thesis found.</p>
                        ) : (
                            filteredBooks.map((book, index) => (
                                <div className="accordion-item border" key={book.id}>
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${index}`}
                                        >
                                            {book.title}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent="#thesisAccordion"
                                    >
                                        <div className="accordion-body">
                                            <p>
                                                <strong>Year:</strong> {book.year}
                                            </p>
                                            <p>
                                                <strong>Keywords:</strong> {book.keyword}
                                            </p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleClick(book.abstract_url)}
                                            >
                                                View Abstract
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ViewPDF = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const pdfUrl = location.state?.pdfUrl;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

 
    useEffect(() => {
        let lastTime = Date.now();
    
        const detectRecording = () => {
            const now = Date.now();
            if (now - lastTime < 500) {
                alert('Screen recording or screenshots are disabled for this content.');
            }
            lastTime = now;
        };
    
        document.addEventListener('visibilitychange', detectRecording);
    
        return () => {
            document.removeEventListener('visibilitychange', detectRecording);
        };
    }, []);
    
    
        // Prevent screenshot using keydown and context menu
        const preventScreenshot = () => {
            document.addEventListener('keydown', blockKeys);
            document.addEventListener('contextmenu', blockContextMenu);
            document.addEventListener('keyup', blockKeys);
            document.body.style.userSelect = 'none'; // Disable text selection
        };

        const blockKeys = (e) => {
            if (
                e.key === 'PrintScreen' || 
                (e.ctrlKey && e.key === 'p') || 
                (e.metaKey && e.key === 'p')
            ) {
                e.preventDefault();
                Swal.fire({
                    icon: 'warning',
                    title: 'Screenshots Disabled',
                    text: 'Screenshots are disabled for this content.',
                });
            
            }
        };

        const blockContextMenu = (e) => e.preventDefault();

        const preventMobileScreenshot = () => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.zIndex = 1000;
            overlay.style.pointerEvents = 'none';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.01)'; // Transparent overlay
            overlay.id = 'mobile-screenshot-blocker';
            document.body.appendChild(overlay);
        };

        preventScreenshot();
        preventMobileScreenshot();

    useEffect(() => {
        if (!pdfUrl) return;

        // Show loading spinner
        Swal.fire({
            title: 'Loading PDF...',
            text: 'Please wait a moment.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        let reloadTimeout;

        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                setLoading(false);
                Swal.close();
                clearTimeout(reloadTimeout); // Clear reload timer on successful load
            };

            iframe.onerror = () => {
                setLoading(false);
                Swal.close();
                setError(true);
            };

            // Set a timeout to reload after 5 seconds if iframe doesn't load
            reloadTimeout = setTimeout(() => {
                Swal.fire({
                    icon: 'warning',
                    title: 'PDF Not Loaded',
                    text: 'The PDF is taking too long to load. Do you want to reload?',
                    showCancelButton: true,
                    confirmButtonText: 'Reload',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload(); // Reload the page
                    }
                });
            }, 10000);
        }

        // Cleanup timeout on component unmount
        return () => clearTimeout(reloadTimeout);
    }, [pdfUrl]);

    if (!pdfUrl) {
        return (
            <div className="container mt-4">
                <p className="text-center text-danger">No PDF URL provided!</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <p className="text-center text-danger">Failed to load PDF!</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                overflow: 'hidden', 
            }}
        >
            {loading && <div className="loading-overlay"></div>}
            <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    overflow: 'hidden', // Prevent iframe scrollbars
                }}
                title="PDF Viewer"
                sandbox="allow-scripts allow-same-origin"
            ></iframe>
        </div>
    );
};

export default ViewPDF;

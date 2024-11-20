import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ViewPDF = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const pdfUrl = location.state?.pdfUrl;
    const [loading, setLoading] = useState(true);

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

        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                setLoading(false);
                Swal.close();
            };
        }

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
                alert('Screenshots are disabled for this content.');
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

        return () => {
            document.removeEventListener('keydown', blockKeys);
            document.removeEventListener('contextmenu', blockContextMenu);
            document.removeEventListener('keyup', blockKeys);
            document.body.style.userSelect = '';
            const overlay = document.getElementById('mobile-screenshot-blocker');
            if (overlay) overlay.remove();
        };
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

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            {loading && <div className="loading-overlay"></div>}
            {/* Transparent overlay to discourage screenshots */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    zIndex: 10,
                    pointerEvents: 'none', 
                    userSelect: 'none'
                }}
            ></div>
            <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    userSelect: 'none'
                }}
                title="PDF Viewer"
            ></iframe>
        </div>
    );
};

export default ViewPDF;

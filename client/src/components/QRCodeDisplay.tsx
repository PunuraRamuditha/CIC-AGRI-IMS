import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
  downloadable?: boolean;
  className?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 200,
  label,
  downloadable = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = React.useState<string>('');

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });

      QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      }).then(url => {
        setQrCodeDataURL(url);
      }).catch(error => {
        console.error('QR Code data URL generation error:', error);
      });
    }
  }, [data, size]);

  const handleDownload = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `${label || 'asset'}-qrcode.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <h4 className="text-sm font-medium text-slate-700 mb-3">{label}</h4>
      )}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <canvas
          ref={canvasRef}
          className="block"
        />
      </div>
      <div className="mt-3 text-center">
        
      </div>
      {downloadable && (
        <button
          onClick={handleDownload}
          className="mt-3 flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Download size={14} />
          Download QR Code
        </button>
      )}
    </div>
  );
};

export default QRCodeDisplay;

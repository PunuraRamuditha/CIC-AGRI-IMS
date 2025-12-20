import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download } from 'lucide-react';

interface BarcodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
  downloadable?: boolean;
  className?: string;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({
  data,
  size = 200,
  label,
  downloadable = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [barcodeDataURL, setBarcodeDataURL] = React.useState<string>('');

  useEffect(() => {
    if (data) {
      // Generate barcode on canvas
      if (canvasRef.current) {
        try {
          JsBarcode(canvasRef.current, data, {
            format: 'CODE128',
            width: 2,
            height: size * 0.3,
            displayValue: true,
            fontSize: 14,
            margin: 10,
            background: '#ffffff',
            lineColor: '#1e293b',
          });

          // Convert canvas to data URL for download
          const dataURL = canvasRef.current.toDataURL('image/png');
          setBarcodeDataURL(dataURL);
        } catch (error) {
          console.error('Barcode generation error:', error);
        }
      }

      // Also generate on SVG as a backup
      if (svgRef.current) {
        try {
          JsBarcode(svgRef.current, data, {
            format: 'CODE128',
            width: 2,
            height: size * 0.3,
            displayValue: true,
            fontSize: 14,
            margin: 10,
            background: '#ffffff',
            lineColor: '#1e293b',
          });
        } catch (error) {
          console.error('Barcode SVG generation error:', error);
        }
      }
    }
  }, [data, size]);

  const handleDownload = () => {
    if (barcodeDataURL) {
      const link = document.createElement('a');
      link.download = `${label || 'asset'}-barcode.png`;
      link.href = barcodeDataURL;
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
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {/* Hidden SVG for fallback */}
        <svg ref={svgRef} style={{ display: 'none' }} />
      </div>
      {downloadable && (
        <button
          onClick={handleDownload}
          className="mt-3 flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Download size={14} />
          Download Barcode
        </button>
      )}
    </div>
  );
};

export default BarcodeDisplay;



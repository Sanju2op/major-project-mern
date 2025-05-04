import { useState } from "react";

const GetSingleEmbedCodeModal = ({ testimonialId, onClose }) => {
  const iframeCode = `<iframe src="${process.env.REACT_APP_FRONTEND_URL}/embed/testimonial/${testimonialId}" width="100%" height="500" frameborder="0"></iframe>`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">Embed This Testimonial</h3>

        <textarea
          value={iframeCode}
          readOnly
          className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-700"
          rows={4}
        />

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            {copied ? "Copied!" : "Copy Embed Code"}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetSingleEmbedCodeModal;

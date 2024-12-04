import React, { useState } from "react";
import { ChevronDown, ChevronRight, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Screenshot {
  url: string;
  thumbnail?: string;
  description?: string;
  timestamp: string;
}

// Screenshot Gallery Component
const ScreenshotGallery: React.FC<{ screenshots: Screenshot[] }> = ({ screenshots }) => {
  const [screenshotView, setScreenshotView] = useState<"grid" | "carousel">("grid");
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(
    screenshots?.[0] || null
  );

  if (!screenshots?.length) return null;

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Screenshots ({screenshots.length})</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreenshotView("grid")}
            className={`p-2 rounded-lg ${
              screenshotView === "grid" ? "bg-blue-100 text-blue-700" : "bg-gray-100"
            }`}
          >
            <div className="grid grid-cols-2 gap-1 w-4 h-4">
              <div className="bg-current" />
              <div className="bg-current" />
              <div className="bg-current" />
              <div className="bg-current" />
            </div>
          </button>
          <button
            onClick={() => setScreenshotView("carousel")}
            className={`p-2 rounded-lg ${
              screenshotView === "carousel" ? "bg-blue-100 text-blue-700" : "bg-gray-100"
            }`}
          >
            <div className="w-4 h-4 border-2 border-current" />
          </button>
        </div>
      </div>

      {screenshotView === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setSelectedScreenshot(screenshot)}
              className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 transition-all"
            >
              <div className="aspect-video relative">
                <img
                  src={screenshot.thumbnail || screenshot.url}
                  alt={screenshot.description || `Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white text-sm truncate">
                  {new Date(screenshot.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
          {screenshots.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot.url}
              alt={screenshot.description || `Screenshot ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                selectedScreenshot === screenshot ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-between items-center text-white">
              <button
                onClick={() => {
                  const currentIndex = screenshots.indexOf(selectedScreenshot!);
                  const prevIndex =
                    (currentIndex - 1 + screenshots.length) % screenshots.length;
                  setSelectedScreenshot(screenshots[prevIndex]);
                }}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <span className="text-sm">
                {selectedScreenshot &&
                  new Date(selectedScreenshot.timestamp).toLocaleTimeString()}
              </span>
              <button
                onClick={() => {
                  const currentIndex = screenshots.indexOf(selectedScreenshot!);
                  const nextIndex = (currentIndex + 1) % screenshots.length;
                  setSelectedScreenshot(screenshots[nextIndex]);
                }}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ScreenshotModal
        screenshot={selectedScreenshot}
        onClose={() => setSelectedScreenshot(null)}
      />
    </div>
  );
};

// Screenshot Modal Component
const ScreenshotModal: React.FC<{
  screenshot: Screenshot | null;
  onClose: () => void;
}> = ({ screenshot, onClose }) => {
  if (!screenshot) return null;

  return (
    <Dialog open={!!screenshot} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Screenshot Details</DialogTitle>
        </DialogHeader>
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={screenshot.url}
            alt={screenshot.description || "Test screenshot"}
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-between items-center text-white">
              <span className="text-sm">
                {new Date(screenshot.timestamp).toLocaleString()}
              </span>
              {screenshot.description && (
                <span className="text-sm font-medium">{screenshot.description}</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// Update the expanded row section in the main component to include screenshots
const ExpandedRow: React.FC<{ row: TestResult }> = ({ row }) => (
    <tr className="bg-gray-50">
      <td colSpan={6} className="p-4 border">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Timing Details</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(row.start_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">End:</span>{" "}
                  {new Date(row.end_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {row.duration.toFixed(2)}s
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Test Details</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Critical:</span> {row.critical}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {row.type}
                </p>
                <p>
                  <span className="font-medium">Suite:</span> {row.suite}
                </p>
              </div>
            </div>
            {row.message && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Error Details</h4>
                <p className="text-red-600 break-words">{row.message}</p>
              </div>
            )}
          </div>
          {row.screenshots && row.screenshots.length > 0 && (
            <ScreenshotGallery screenshots={row.screenshots} />
          )}
        </div>
      </td>
    </tr>
  );

export { ScreenshotGallery, ScreenshotModal, ExpandedRow };
import { QrManageClient } from "./QrManageClient";

export default function InStorePage() {
  return (
    <div>
      <div className="print:hidden">
        <h1 className="font-serif text-2xl font-medium text-stone-800">In-store QR</h1>
        <p className="mt-1 text-stone-600">
          Print this and put it on display — customers scan it to open the menu.
        </p>
      </div>
      <div className="mt-6">
        <QrManageClient />
      </div>
    </div>
  );
}

import { useState } from "react";
import { TicketPercent } from "lucide-react";
import vouchers from "../../pseudo-db/voucher.json";

interface VoucherPanelProps {
  setSelectedVoucher: (voucher: any) => void;
}

const VoucherPanel: React.FC<VoucherPanelProps> = ({ setSelectedVoucher }) => {
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-8 p-6 border border-gray-300 rounded-lg shadow-md">
      {/* Header dengan Icon Voucher */}
      <div className="flex items-center gap-2 mb-4">
        <TicketPercent className="w-6 h-6 text-[#7f0353]" />
        <h2 className="font-bold text-lg">Voucher Fesy</h2>
      </div>

      {/* Tombol Pilih Voucher */}
      <button
        className="border px-4 py-2 rounded-lg text-[#7f0353] font-bold hover:bg-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        {tempSelectedVoucher ? `Voucher: ${tempSelectedVoucher.kode}` : "Pilih Voucher"}
      </button>

      {/* Menampilkan Detail Voucher */}
      {tempSelectedVoucher && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center">
          <div>
            <p className="text-md font-bold">{tempSelectedVoucher.kode}</p>
            <p className="text-sm text-gray-500">{tempSelectedVoucher.deskripsi}</p>
            {tempSelectedVoucher.berakhirDalam && (
              <p className="text-xs text-red-500">
                Berlaku {tempSelectedVoucher.berakhirDalam} hari lagi
              </p>
            )}
            {tempSelectedVoucher.minimalBelanja && (
              <p className="text-xs text-blue-500">
                Min. belanja Rp {tempSelectedVoucher.minimalBelanja.toLocaleString()}
              </p>
            )}
          </div>
          {/* Tombol Batal */}
          <button 
            className="text-red-700" 
            onClick={() => {
                setTempSelectedVoucher(null);
                setSelectedVoucher(null); 
            }}
            >
            Batal
            </button>

        </div>
      )}

      {/* Modal Pilih Voucher */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[70vh] flex flex-col">
            <h3 className="font-bold text-lg mb-4 flex">
              <TicketPercent className="w-7 h-7 text-[#7f0353] mr-2" /> Pilih Voucher
            </h3>

            {/* List Voucher dengan Scroll */}
            <div className="space-y-3 overflow-y-auto flex-1 max-h-[50vh]">
              {vouchers.map((voucher) => (
                <label
                  key={voucher.id}
                  className={`block w-full text-left p-3 border rounded cursor-pointer ${
                    tempSelectedVoucher?.id === voucher.id ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setTempSelectedVoucher(voucher)}
                >
                  <p className="text-md font-bold">{voucher.kode}</p>
                  <p className="text-xs text-gray-500">{voucher.deskripsi}</p>
                  {voucher.minimalBelanja && (
                    <p className="text-xs text-gray-500">
                      Min. belanja Rp {voucher.minimalBelanja.toLocaleString()}
                    </p>
                  )}
                  {voucher.berakhirDalam && (
                    <p className="text-xs mt-2 text-red-500">
                      Berakhir dalam {voucher.berakhirDalam} hari 
                    </p>
                  )}
                </label>
              ))}
            </div>

            {/* Tombol Konfirmasi */}
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 mr-2 rounded-lg font-bold hover:bg-gray-400"
                onClick={() => {
                  setTempSelectedVoucher(null);
                  setIsModalOpen(false);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-[#7f0353] text-white rounded-lg font-bold hover:bg-[#650242]"
                disabled={!tempSelectedVoucher}
                onClick={() => {
                  setSelectedVoucher(tempSelectedVoucher);
                  setIsModalOpen(false);
                }}
              >
                Pakai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPanel;
